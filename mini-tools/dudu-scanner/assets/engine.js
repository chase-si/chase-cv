(function (global) {
  var NS = (global.DuduScanner = global.DuduScanner || {});

  var AUTO_SCAN_MS = 4000;
  var MIN_DISCOVERY_MS = 10000;
  var DISCOVERY_DWELL_MS = 800;
  var LOCK_DELAY_MS = 2600;
  var REVEAL_DURATION_MS = 1500;
  var TRANSIENT_MS = 2800;
  var DOUBLE_CLICK_LOCK = 0.9;
  var DESKTOP_SPOTLIGHT = 100;
  var MOBILE_SPOTLIGHT = 70;
  var DISCOVERY_DECAY = 1.5;
  var FAN_SWEEP = (Math.PI * 5) / 6;
  var MAX_DPR = 1.5;
  var RESIZE_THROTTLE_MS = 120;
  var SOUND_MASTER = 0.5;
  var SOUND_RAMP = 0.09;

  NS.AUTO_SCAN_MS = AUTO_SCAN_MS;
  NS.LOCK_DELAY_MS = LOCK_DELAY_MS;
  NS.REVEAL_DURATION_MS = REVEAL_DURATION_MS;
  NS.TRANSIENT_MS = TRANSIENT_MS;
  NS.DESKTOP_SPOTLIGHT = DESKTOP_SPOTLIGHT;
  NS.MOBILE_SPOTLIGHT = MOBILE_SPOTLIGHT;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }
  function clamp01(value) {
    return clamp(value, 0, 1);
  }
  function lerp(from, to, alpha) {
    return from + (to - from) * alpha;
  }
  function easeOutCubic(value) {
    var inverse = 1 - clamp01(value);
    return 1 - inverse * inverse * inverse;
  }
  function easeInOutCubic(value) {
    var progress = clamp01(value);
    return progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2;
  }

  var initialScan = {
    stage: "idle",
    placementVersion: 0,
    targetRevealed: false,
    revealComplete: false,
    locking: false,
    paused: false,
  };

  function copyScan(extra) {
    var next = {
      stage: initialScan.stage,
      placementVersion: initialScan.placementVersion,
      targetRevealed: initialScan.targetRevealed,
      revealComplete: initialScan.revealComplete,
      locking: initialScan.locking,
      paused: initialScan.paused,
    };
    var key;
    if (extra) {
      for (key in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, key)) {
          next[key] = extra[key];
        }
      }
    }
    return next;
  }

  NS.createInitialRoundState = function () {
    return { phase: "config", scan: copyScan(), transient: null };
  };

  function freshScan(transient, placementVersion) {
    return {
      phase: "scan",
      scan: copyScan({ stage: "auto-scan", placementVersion: placementVersion || 0 }),
      transient: transient || null,
    };
  }

  NS.roundReducer = function (state, action) {
    switch (action.type) {
      case "START_SCAN":
        if (state.phase !== "config") return state;
        return freshScan();
      case "AUTO_SCAN_COMPLETE":
        if (state.phase !== "scan" || state.scan.stage !== "auto-scan") return state;
        return { phase: "scan", scan: copyScan(Object.assign({}, state.scan, { stage: "search" })), transient: null };
      case "DISCOVER_TARGET":
        if (state.phase !== "scan" || (state.scan.stage !== "auto-scan" && state.scan.stage !== "search")) return state;
        return {
          phase: "scan",
          scan: copyScan(Object.assign({}, state.scan, {
            stage: "signal-found",
            targetRevealed: false,
            revealComplete: false,
            paused: false,
          })),
          transient: null,
        };
      case "BEGIN_TARGET_REVEAL":
        if (state.phase !== "scan" || state.scan.stage !== "signal-found") return state;
        return {
          phase: "scan",
          scan: copyScan(Object.assign({}, state.scan, { stage: "target-reveal", targetRevealed: true })),
          transient: state.transient,
        };
      case "REVEAL_COMPLETE":
        if (state.phase !== "scan" || state.scan.stage !== "target-reveal" || !state.scan.targetRevealed) return state;
        return {
          phase: "scan",
          scan: copyScan(Object.assign({}, state.scan, { revealComplete: true })),
          transient: state.transient,
        };
      case "TOGGLE_PAUSE":
        if (state.phase !== "scan" || state.scan.locking) return state;
        return {
          phase: "scan",
          scan: copyScan(Object.assign({}, state.scan, { paused: !state.scan.paused })),
          transient: null,
        };
      case "LOCK_SIGNAL":
        if (state.phase !== "scan" || state.scan.locking || state.scan.paused) return state;
        if (!state.scan.targetRevealed) return { phase: "scan", scan: state.scan, transient: "no-signal" };
        if (!state.scan.revealComplete) return state;
        return {
          phase: "scan",
          scan: copyScan(Object.assign({}, state.scan, { stage: "locking", locking: true })),
          transient: null,
        };
      case "LOCK_COMPLETE":
        if (state.phase !== "scan" || !state.scan.locking) return state;
        return {
          phase: "result",
          scan: copyScan({ placementVersion: state.scan.placementVersion }),
          transient: null,
        };
      case "CANCEL_TARGET":
        if (state.phase !== "scan") return state;
        return {
          phase: "scan",
          scan: copyScan({ stage: "search", placementVersion: state.scan.placementVersion }),
          transient: "no-signal",
        };
      case "RESTART_SCAN":
        if (state.phase !== "scan") return state;
        return freshScan(null, state.scan.placementVersion + 1);
      case "RETURN_TO_CONFIG":
      case "CHANGE_TARGET":
        if (state.phase === "config" && action.type === "RETURN_TO_CONFIG") return state;
        if (action.type === "CHANGE_TARGET" && state.phase !== "result") return state;
        return NS.createInitialRoundState();
      case "SCAN_AGAIN":
        if (state.phase !== "result") return state;
        return freshScan(null, state.scan.placementVersion + 1);
      case "CLEAR_TRANSIENT":
        if (state.transient === null) return state;
        return { phase: state.phase, scan: state.scan, transient: null };
      default:
        return state;
    }
  };

  NS.computeFanGeometry = function (width, height) {
    var cx = width * 0.5;
    var cy = height * 0.92;
    var sweep = FAN_SWEEP;
    var insetX = 2;
    var insetY = Math.min(width, height) * 0.04;
    var radiusFromBox = Math.min(width, height) * 0.78;
    var radiusFromWidth = Math.max(0, (cx - insetX) / Math.sin(sweep / 2));
    var radiusFromHeight = Math.max(0, cy - insetY);
    var radius = Math.min(radiusFromBox, radiusFromWidth, radiusFromHeight);
    return { cx: cx, cy: cy, radius: radius, sweep: sweep, startAngle: -Math.PI / 2 - sweep / 2 };
  };

  function fanBounds(fan) {
    var endAngle = fan.startAngle + fan.sweep;
    var points = [
      { x: fan.cx, y: fan.cy },
      { x: fan.cx + Math.cos(fan.startAngle) * fan.radius, y: fan.cy + Math.sin(fan.startAngle) * fan.radius },
      { x: fan.cx + Math.cos(endAngle) * fan.radius, y: fan.cy + Math.sin(endAngle) * fan.radius },
      { x: fan.cx, y: fan.cy - fan.radius },
    ];
    var minX = points[0].x, maxX = points[0].x, minY = points[0].y, maxY = points[0].y;
    for (var i = 1; i < points.length; i += 1) {
      minX = Math.min(minX, points[i].x);
      maxX = Math.max(maxX, points[i].x);
      minY = Math.min(minY, points[i].y);
      maxY = Math.max(maxY, points[i].y);
    }
    return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
  }

  NS.isPointInFan = function (point, fan) {
    var dx = point.x - fan.cx;
    var dy = point.y - fan.cy;
    if (Math.hypot(dx, dy) > fan.radius) return false;
    var angle = Math.atan2(dy, dx);
    return angle >= fan.startAngle && angle <= fan.startAngle + fan.sweep;
  };

  NS.computeScanField = function (width, height, shape) {
    if (shape === "rect") {
      return { kind: "rect", x: 0, y: 0, width: Math.max(0, width), height: Math.max(0, height) };
    }
    var fan = NS.computeFanGeometry(width, height);
    return {
      kind: "fan",
      cx: fan.cx,
      cy: fan.cy,
      radius: fan.radius,
      sweep: fan.sweep,
      startAngle: fan.startAngle,
    };
  };

  NS.isPointInScanField = function (point, field) {
    if (field.kind === "rect") {
      return point.x >= field.x && point.x <= field.x + field.width && point.y >= field.y && point.y <= field.y + field.height;
    }
    return NS.isPointInFan(point, field);
  };

  NS.clampTargetInScanField = function (point, field, targetRadius) {
    if (field.kind === "fan") return clampTargetInFan(point, field, targetRadius);
    var insetX = Math.min(targetRadius, field.width / 2);
    var insetY = Math.min(targetRadius, field.height / 2);
    return {
      x: Math.min(field.x + field.width - insetX, Math.max(field.x + insetX, point.x)),
      y: Math.min(field.y + field.height - insetY, Math.max(field.y + insetY, point.y)),
    };
  };

  NS.placeTargetInScanField = function (seed, field, targetRadius) {
    if (field.kind === "fan") return NS.placeTargetInSafeRegion(seed, field, targetRadius);
    var inset = Math.min(targetRadius + 8, field.width / 2, field.height / 2);
    var innerWidth = Math.max(1, field.width - inset * 2);
    var innerHeight = Math.max(1, field.height - inset * 2);
    return NS.clampTargetInScanField(
      {
        x: field.x + inset + innerWidth * (0.18 + seededUnit(seed, 1) * 0.64),
        y: field.y + inset + innerHeight * (0.18 + seededUnit(seed, 2) * 0.64),
      },
      field,
      targetRadius,
    );
  };

  NS.scanFieldContainsTargetDisc = function (field, point, targetRadius) {
    if (field.kind === "rect") {
      return (
        point.x - targetRadius >= field.x - 0.01 &&
        point.x + targetRadius <= field.x + field.width + 0.01 &&
        point.y - targetRadius >= field.y - 0.01 &&
        point.y + targetRadius <= field.y + field.height + 0.01
      );
    }
    var dist = Math.hypot(point.x - field.cx, point.y - field.cy);
    return dist + targetRadius <= field.radius + 0.01 && NS.isPointInFan(point, field);
  };

  function seededUnit(seed, channel) {
    var value = Math.sin(seed * 12.9898 + channel * 78.233) * 43758.5453;
    return value - Math.floor(value);
  }

  function clampTargetInFan(point, fan, targetRadius) {
    var x = point.x;
    var y = point.y;
    var dx = x - fan.cx;
    var dy = y - fan.cy;
    var dist = Math.hypot(dx, dy);
    var maxDist = Math.max(fan.radius - targetRadius, targetRadius);
    if (dist > maxDist) {
      var scale = maxDist / dist;
      x = fan.cx + dx * scale;
      y = fan.cy + dy * scale;
    }
    var angle = Math.atan2(dy, dx);
    var minAngle = fan.startAngle + 0.08;
    var maxAngle = fan.startAngle + fan.sweep - 0.08;
    if (angle < minAngle || angle > maxAngle) {
      var clampedAngle = Math.min(Math.max(angle, minAngle), maxAngle);
      x = fan.cx + Math.cos(clampedAngle) * Math.min(dist, maxDist);
      y = fan.cy + Math.sin(clampedAngle) * Math.min(dist, maxDist);
    }
    return { x: x, y: y };
  }

  NS.placeTargetInSafeRegion = function (seed, fan, targetRadius) {
    var bounds = fanBounds(fan);
    var safeWidth = (bounds.maxX - bounds.minX) * 0.35;
    var safeHeight = (bounds.maxY - bounds.minY) * 0.35;
    var centerX = (bounds.minX + bounds.maxX) * 0.5;
    var centerY = bounds.minY + (bounds.maxY - bounds.minY) * 0.42;
    var angle = seededUnit(seed, 1) * Math.PI * 2;
    var dist = seededUnit(seed, 2) * 0.45;
    return clampTargetInFan(
      { x: centerX + Math.cos(angle) * safeWidth * dist, y: centerY + Math.sin(angle) * safeHeight * dist },
      fan,
      targetRadius,
    );
  };

  function signalBandForStrength(strength) {
    if (strength >= 2 / 3) return "strong";
    if (strength >= 1 / 3) return "medium";
    return "weak";
  }

  function computeProximitySignal(probe, target, options) {
    var distance = Math.hypot(probe.x - target.x, probe.y - target.y);
    var strength = options.signalRadius > 0 ? clamp01(1 - distance / options.signalRadius) : 0;
    return {
      distance: distance,
      strength: strength,
      band: signalBandForStrength(strength),
      insideRevealRadius: distance <= options.revealRadius,
    };
  }

  function advanceDiscoveryDwell(currentDwellMs, input) {
    var dwellMs = currentDwellMs;
    if (input.roundElapsedMs < MIN_DISCOVERY_MS) {
      dwellMs = 0;
    } else if (!input.probeInside) {
      dwellMs = currentDwellMs;
    } else if (input.insideRevealRadius) {
      dwellMs = Math.min(DISCOVERY_DWELL_MS, currentDwellMs + Math.max(0, input.deltaMs));
    } else {
      dwellMs = Math.max(0, currentDwellMs - Math.max(0, input.deltaMs) * DISCOVERY_DECAY);
    }
    return { dwellMs: dwellMs, discovered: dwellMs >= DISCOVERY_DWELL_MS };
  }

  NS.isDoubleClickLockEligible = function (targetRevealed, signalStrength) {
    return targetRevealed && signalStrength > DOUBLE_CLICK_LOCK;
  };

  function createPointerSmoother() {
    var previous = null;
    var lastTimestamp = 0;
    var smoothing = 0.14;
    return {
      reset: function () {
        previous = null;
        lastTimestamp = 0;
      },
      push: function (sample, width, height) {
        var nx = width <= 0 ? 0.5 : clamp01(sample.x / width);
        var ny = height <= 0 ? 0.5 : clamp01(sample.y / height);
        var dt = lastTimestamp > 0 ? Math.max(1, sample.timestamp - lastTimestamp) : 16;
        lastTimestamp = sample.timestamp;
        var rawVx = previous ? (nx - previous.x) / dt : 0;
        var rawVy = previous ? (ny - previous.y) / dt : 0;
        var smoothed = previous
          ? {
              x: lerp(previous.x, nx, smoothing),
              y: lerp(previous.y, ny, smoothing),
              vx: lerp(previous.vx, rawVx, smoothing),
              vy: lerp(previous.vy, rawVy, smoothing),
            }
          : { x: nx, y: ny, vx: 0, vy: 0 };
        previous = smoothed;
        var speed = Math.hypot(smoothed.vx, smoothed.vy);
        return {
          x: smoothed.x,
          y: smoothed.y,
          vx: smoothed.vx,
          vy: smoothed.vy,
          signalStrength: clamp01(0.22 + speed * 4200),
          textureOffsetX: (smoothed.x - 0.5) * 0.08,
          textureOffsetY: (smoothed.y - 0.5) * 0.08,
          scanLineBias: clamp(smoothed.x - 0.5, -0.35, 0.35),
        };
      },
    };
  }

  function neutralProbe() {
    return {
      x: 0.5, y: 0.5, vx: 0, vy: 0,
      signalStrength: 0.22, textureOffsetX: 0, textureOffsetY: 0, scanLineBias: 0,
    };
  }

  function motionPolicy(reduced) {
    return reduced
      ? { driftSpeed: 0.35, textureMotion: 0.4, revealDurationScale: 0.55 }
      : { driftSpeed: 1, textureMotion: 1, revealDurationScale: 1 };
  }

  function advanceTargetMotion(state, fan, targetRadius, elapsedSeconds, seed, driftSpeed) {
    var driftAngle = elapsedSeconds * 0.22 * driftSpeed + seed * 0.7;
    var driftRadius = 6 + Math.sin(elapsedSeconds * 0.31 * driftSpeed + seed) * 4;
    return {
      position: clampTargetInFan(
        {
          x: state.position.x + Math.cos(driftAngle) * driftRadius * 0.016 * driftSpeed,
          y: state.position.y + Math.sin(driftAngle * 0.9) * driftRadius * 0.012 * driftSpeed,
        },
        fan,
        targetRadius,
      ),
      clarityBoost: Math.max(0, state.clarityBoost * 0.92),
    };
  }

  function scanLineCrossBoost(beamAngle, target, fan) {
    var targetAngle = Math.atan2(target.y - fan.cy, target.x - fan.cx);
    var delta = Math.abs(Math.atan2(Math.sin(beamAngle - targetAngle), Math.cos(beamAngle - targetAngle)));
    if (delta > 0.12) return 0;
    return 1 - delta / 0.12;
  }

  function hashNoise(x, y, frame) {
    var value = Math.sin(x * 12.9898 + y * 78.233 + frame * 0.17) * 43758.5453;
    return value - Math.floor(value);
  }

  function resolveMysteryTargetPresentation(clarity, spotlightHovered, reducedMotion, frame) {
    var resolvedClarity = clamp01(clarity);
    var focusPulse = spotlightHovered && !reducedMotion ? 1 + Math.sin(frame * 0.1) * 0.04 : 1;
    if (spotlightHovered) {
      return {
        alpha: 0.82 + resolvedClarity * 0.16,
        brightness: 0.94,
        contrast: 1.45,
        blurPx: (1 - resolvedClarity) * 1.5,
        targetScale: 1.5 * focusPulse,
        shadowBlurPx: 22,
        ringAlpha: 0.82,
        ringWidth: 3,
        haloAlpha: 0.26,
      };
    }
    return {
      alpha: 0.32 + resolvedClarity * 0.18,
      brightness: 0.42,
      contrast: 2.15,
      blurPx: 3 + (1 - resolvedClarity) * 3,
      targetScale: 1.38,
      shadowBlurPx: 6,
      ringAlpha: 0.2,
      ringWidth: 1.5,
      haloAlpha: 0,
    };
  }

  NS.createScannerVisualRenderer = function (options) {
    var canvas = options.canvas;
    var context = canvas.getContext("2d");
    if (!context) throw new Error("2d context unavailable");
    var getStageRect = options.getStageRect;
    var getNow = options.getNow || function () { return performance.now(); };
    var requestFrame = options.requestFrame || function (cb) { return window.requestAnimationFrame(cb); };
    var cancelFrame = options.cancelFrame || function (id) { window.cancelAnimationFrame(id); };
    var getTargetImage = options.getTargetImage || function () { return null; };
    var targetDisplayRadius = options.targetDisplayRadius || 28;
    var spotlightRadius = options.spotlightRadius || DESKTOP_SPOTLIGHT;
    var palette = options.palette || {
      spotlightOverlay: "rgba(242,241,230,0.7)",
      spotlightFeather: "rgba(242,241,230,0.75)",
      spotlightAccent: "rgba(168,85,247,0.72)",
      spotlightParticle: "rgba(168,85,247,0.5)",
    };
    var onDiscovery = options.onDiscovery;
    var onMetrics = options.onMetrics;
    var metricsIntervalMs = options.metricsIntervalMs || 80;
    var maxFramesPerSecond = options.maxFramesPerSecond || 30;
    var regionShape = options.regionShape || "fan";

    var state = {
      active: true,
      explorationEnabled: false,
      showLockFrame: false,
      targetRevealed: false,
      revealProgress: 0,
      locking: false,
      mysteryMode: false,
      reducedMotion: false,
      placementSeed: 1,
    };
    var rafId = 0;
    var started = false;
    var pageVisible = true;
    var hiddenAt = null;
    var frame = 0;
    var startedAt = getNow();
    var lastFrameAt = startedAt;
    var dwellMs = 0;
    var discoveryNotified = false;
    var lastMetricsAt = Number.NEGATIVE_INFINITY;
    var lastResizeAt = 0;
    var destroyed = false;
    var smoother = createPointerSmoother();
    var probe = neutralProbe();
    var probeInside = false;
    var probeHasEntered = false;
    var targetMotion = null;
    var lockStartedAt = null;
    var cssWidth = 1;
    var cssHeight = 1;
    var lastRenderedAt = Number.NEGATIVE_INFINITY;
    var noiseTextures = [];
    function getField() {
      return NS.computeScanField(cssWidth, cssHeight, regionShape);
    }

    function buildNoiseTextures(width, height) {
      var textureWidth = Math.max(1, Math.ceil(width));
      var textureHeight = Math.max(1, Math.ceil(height));
      noiseTextures = [];
      var t, texture, texCtx, y, x, n, gray;
      for (t = 0; t < 3; t += 1) {
        texture = document.createElement("canvas");
        texture.width = textureWidth;
        texture.height = textureHeight;
        texCtx = texture.getContext("2d");
        if (texCtx) {
          for (y = 0; y < textureHeight; y += 6) {
            for (x = 0; x < textureWidth; x += 6) {
              n = hashNoise(x * 0.04, y * 0.04, t * 13);
              gray = Math.floor(18 + n * 42);
              texCtx.fillStyle = "rgba(" + gray + "," + (gray + 4) + "," + (gray + 8) + ",0.55)";
              texCtx.fillRect(x, y, 6, 6);
            }
          }
        }
        noiseTextures.push(texture);
      }
    }

    function resetTargetMotion() {
      var field = getField();
      targetMotion = { position: NS.placeTargetInScanField(state.placementSeed, field, targetDisplayRadius), clarityBoost: 0 };
    }

    function applyCanvasSize(layout) {
      cssWidth = layout.cssWidth;
      cssHeight = layout.cssHeight;
      canvas.width = layout.pixelWidth;
      canvas.height = layout.pixelHeight;
      canvas.style.width = layout.cssWidth + "px";
      canvas.style.height = layout.cssHeight + "px";
      context.setTransform(layout.devicePixelRatio, 0, 0, layout.devicePixelRatio, 0, 0);
      var field = getField();
      if (field.kind === "rect") buildNoiseTextures(field.width, field.height);
      else buildNoiseTextures(field.radius * 2, field.radius);
      resetTargetMotion();
    }

    function resize(force) {
      var rect = getStageRect();
      var now = getNow();
      if (!force && now - lastResizeAt < RESIZE_THROTTLE_MS) return;
      lastResizeAt = now;
      var dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), MAX_DPR);
      applyCanvasSize({
        cssWidth: rect.width,
        cssHeight: rect.height,
        pixelWidth: Math.max(1, Math.floor(rect.width * dpr)),
        pixelHeight: Math.max(1, Math.floor(rect.height * dpr)),
        devicePixelRatio: dpr,
      });
    }

    function getProximity() {
      if (!state.explorationEnabled || !targetMotion) return null;
      return computeProximitySignal(
        { x: probe.x * cssWidth, y: probe.y * cssHeight },
        targetMotion.position,
        { revealRadius: 120, signalRadius: Math.max(spotlightRadius * 4.2, 1) },
      );
    }

    function getMetrics() {
      var proximity = getProximity();
      var signalStrength = proximity ? proximity.strength : probe.signalStrength;
      return {
        signalStrength: signalStrength,
        signalBand: proximity ? proximity.band : signalBandForStrength(signalStrength),
        probeInside: probeInside,
        probeHasEntered: probeHasEntered,
        dwellProgress: dwellMs / DISCOVERY_DWELL_MS,
        roundElapsedMs: Math.max(0, getNow() - startedAt),
        spotlightVisible: state.explorationEnabled && probeInside,
        spotlightRadius: spotlightRadius,
        probeVelocity: Math.min(1, Math.hypot(probe.vx, probe.vy) * 4200),
        textureOffsetX: probe.textureOffsetX,
        textureOffsetY: probe.textureOffsetY,
        scanLineBias: probe.scanLineBias,
        gain: 0.42 + signalStrength * 0.35,
        scanFrequencyHz: 0.9 + signalStrength * 0.25,
      };
    }

    function clipScanField(field) {
      context.beginPath();
      if (field.kind === "rect") {
        context.moveTo(field.x, field.y);
        context.lineTo(field.x + field.width, field.y);
        context.lineTo(field.x + field.width, field.y + field.height);
        context.lineTo(field.x, field.y + field.height);
        context.closePath();
      } else {
        context.moveTo(field.cx, field.cy);
        context.arc(field.cx, field.cy, field.radius, field.startAngle, field.startAngle + field.sweep);
        context.closePath();
      }
      context.clip();
    }

    function fieldBox(field) {
      if (field.kind === "rect") return { x: field.x, y: field.y, width: field.width, height: field.height };
      return { x: field.cx - field.radius, y: field.cy - field.radius, width: field.radius * 2, height: field.radius };
    }

    function drawNoiseLayer(field, motionScale) {
      if (!noiseTextures.length) return;
      var textureFrame = Math.floor(frame * Math.max(0.25, motionScale) * 0.18);
      var texture = noiseTextures[textureFrame % noiseTextures.length];
      var box = fieldBox(field);
      context.drawImage(texture, box.x, box.y, box.width, field.kind === "rect" ? box.height : field.radius);
    }

    function drawTextureLayer(field, motionScale, offsetX, offsetY) {
      var box = fieldBox(field);
      var scale = field.kind === "rect" ? Math.min(field.width, field.height) : field.radius;
      var cx = field.kind === "rect" ? field.x + field.width * 0.5 : field.cx;
      var cy = field.kind === "rect" ? field.y + field.height * 0.5 : field.cy;
      var index, phase, bx, by, gradient;
      for (index = 0; index < 5; index += 1) {
        phase = frame * 0.008 * motionScale + index * 1.7;
        bx = cx + Math.cos(phase) * scale * 0.35 + offsetX * scale;
        by = cy - scale * (0.15 + index * 0.08) + offsetY * scale;
        gradient = context.createRadialGradient(bx, by, 4, bx, by, scale * 0.22);
        gradient.addColorStop(0, "rgba(120, 140, 120, 0.12)");
        gradient.addColorStop(1, "rgba(40, 50, 40, 0)");
        context.fillStyle = gradient;
        context.fillRect(box.x, box.y, box.width, field.kind === "rect" ? box.height : field.radius);
      }
    }

    function drawSpotlight(field, motionScale) {
      var box = fieldBox(field);
      var coverHeight = field.kind === "rect" ? box.height : field.radius * 2;
      context.fillStyle = palette.spotlightOverlay;
      context.fillRect(box.x, box.y, box.width, coverHeight);
      if (!probeInside) return;
      var probeX = probe.x * cssWidth;
      var probeY = probe.y * cssHeight;
      var signalStrength = (getProximity() || { strength: probe.signalStrength }).strength;
      context.save();
      context.beginPath();
      context.arc(probeX, probeY, spotlightRadius, 0, Math.PI * 2);
      context.clip();
      context.globalAlpha = 0.65 + signalStrength * 0.35;
      drawNoiseLayer(field, motionScale);
      drawTextureLayer(field, motionScale, probe.textureOffsetX, probe.textureOffsetY);
      var feather = context.createRadialGradient(probeX, probeY, spotlightRadius * 0.55, probeX, probeY, spotlightRadius);
      feather.addColorStop(0, "transparent");
      feather.addColorStop(1, palette.spotlightFeather);
      context.fillStyle = feather;
      context.fillRect(probeX - spotlightRadius, probeY - spotlightRadius, spotlightRadius * 2, spotlightRadius * 2);
      context.restore();
      context.save();
      var pulse = state.reducedMotion ? 0 : Math.sin(frame * (0.06 + signalStrength * 0.08)) * (2 + signalStrength * 5);
      context.strokeStyle = palette.spotlightAccent;
      context.lineWidth = 1.5 + signalStrength * 1.5;
      context.beginPath();
      context.arc(probeX, probeY, spotlightRadius + 8 + pulse, 0, Math.PI * 2);
      context.stroke();
      context.beginPath();
      context.moveTo(probeX - 12, probeY);
      context.lineTo(probeX + 12, probeY);
      context.moveTo(probeX, probeY - 12);
      context.lineTo(probeX, probeY + 12);
      context.stroke();
      if (!state.reducedMotion) {
        context.fillStyle = palette.spotlightParticle;
        var i, ang, radius;
        for (i = 0; i < 6; i += 1) {
          ang = frame * 0.018 + (i / 6) * Math.PI * 2;
          radius = spotlightRadius + 15 + (i % 2) * 7;
          context.beginPath();
          context.arc(probeX + Math.cos(ang) * radius, probeY + Math.sin(ang) * radius, 1.5, 0, Math.PI * 2);
          context.fill();
        }
      }
      context.restore();
    }

    function drawTarget(motion, reveal, spotlightHovered) {
      if (!state.targetRevealed || reveal <= 0) return;
      var clarity = Math.min(1, reveal * 0.55 + motion.clarityBoost * 0.45);
      var mysteryPresentation = state.mysteryMode
        ? resolveMysteryTargetPresentation(clarity, spotlightHovered, state.reducedMotion, frame)
        : null;
      var size = targetDisplayRadius * 2 * (0.8 + clarity * 0.2) * (mysteryPresentation ? mysteryPresentation.targetScale : 1);
      context.save();
      context.translate(motion.position.x, motion.position.y);
      context.globalAlpha = mysteryPresentation
        ? mysteryPresentation.alpha
        : spotlightHovered ? 0.35 + clarity * 0.65 : 0.12 + clarity * 0.45;
      var targetImage = getTargetImage();
      if (targetImage) {
        context.filter = mysteryPresentation
          ? "grayscale(1) brightness(" + mysteryPresentation.brightness + ") contrast(" + mysteryPresentation.contrast + ") blur(" + mysteryPresentation.blurPx + "px) drop-shadow(0 0 " + mysteryPresentation.shadowBlurPx + "px " + palette.spotlightAccent + ")"
          : spotlightHovered
            ? "grayscale(0) saturate(1.12) contrast(" + (0.85 + clarity * 0.25) + ") blur(" + ((1 - clarity) * 4) + "px)"
            : "grayscale(1) contrast(" + (0.65 + clarity * 0.25) + ") blur(" + ((1 - clarity) * 4) + "px)";
        context.drawImage(targetImage, -size / 2, -size / 2, size, size);
        if (mysteryPresentation) {
          context.filter = "none";
          context.globalAlpha = mysteryPresentation.ringAlpha;
          context.strokeStyle = palette.spotlightAccent;
          context.lineWidth = mysteryPresentation.ringWidth;
          context.beginPath();
          context.arc(0, 0, size * 0.58, 0, Math.PI * 2);
          context.stroke();
          if (mysteryPresentation.haloAlpha > 0) {
            context.globalAlpha = mysteryPresentation.haloAlpha;
            context.lineWidth = 1.5;
            context.beginPath();
            context.arc(0, 0, size * 0.7, 0, Math.PI * 2);
            context.stroke();
          }
        }
      } else {
        context.fillStyle = "rgba(180, 190, 180, 0.35)";
        context.beginPath();
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
        context.fill();
      }
      context.restore();
    }

    function drawLockFinale(field, motion, progress) {
      var targetImage = getTargetImage();
      var waveProgress = easeOutCubic(progress / 0.34);
      var travelProgress = easeInOutCubic((progress - 0.16) / 0.46);
      var colorProgress = easeInOutCubic((progress - 0.46) / 0.38);
      var particleProgress = easeOutCubic((progress - 0.5) / 0.5);
      var finaleX = field.kind === "rect" ? field.x + field.width * 0.5 : field.cx;
      var finaleY = field.kind === "rect" ? field.y + field.height * 0.42 : field.cy - field.radius * 0.48;
      var x = lerp(motion.position.x, finaleX, travelProgress);
      var y = lerp(motion.position.y, finaleY, travelProgress);
      var startSize = targetDisplayRadius * 2;
      var span = field.kind === "rect" ? Math.min(field.width, field.height) : field.radius;
      var finaleSize = Math.min(280, Math.max(150, span * 0.5));
      var size = lerp(startSize, finaleSize, easeOutCubic(travelProgress));
      context.save();
      context.strokeStyle = palette.spotlightAccent;
      var index, ringProgress;
      for (index = 0; index < 3; index += 1) {
        ringProgress = clamp01(waveProgress - index * 0.16);
        if (ringProgress <= 0) continue;
        context.globalAlpha = (1 - ringProgress) * 0.8;
        context.lineWidth = 2 + (1 - ringProgress) * 3;
        context.beginPath();
        context.arc(motion.position.x, motion.position.y, targetDisplayRadius + ringProgress * span * 0.62, 0, Math.PI * 2);
        context.stroke();
      }
      context.restore();
      if (targetImage) {
        context.save();
        context.translate(x, y);
        var arrivalPulse = state.reducedMotion || travelProgress < 0.92 ? 1 : 1 + Math.sin((travelProgress - 0.92) * Math.PI * 12) * 0.035;
        var pulseSize = size * arrivalPulse;
        context.globalAlpha = 0.62 + colorProgress * 0.38;
        context.filter = "grayscale(" + (1 - colorProgress) + ") saturate(" + (0.7 + colorProgress * 0.55) + ") contrast(" + (1.45 - colorProgress * 0.35) + ") drop-shadow(0 0 " + (8 + colorProgress * 20) + "px " + palette.spotlightAccent + ")";
        context.drawImage(targetImage, -pulseSize / 2, -pulseSize / 2, pulseSize, pulseSize);
        context.restore();
      }
      if (particleProgress > 0 && !state.reducedMotion) {
        context.save();
        context.fillStyle = palette.spotlightParticle;
        var p, ang, distance, particleSize;
        for (p = 0; p < 18; p += 1) {
          ang = (p / 18) * Math.PI * 2 + frame * 0.012;
          distance = finaleSize * (0.42 + particleProgress * (0.36 + (p % 4) * 0.06));
          particleSize = 1.5 + (p % 3);
          context.globalAlpha = Math.sin(clamp01(particleProgress) * Math.PI) * (0.45 + (p % 2) * 0.25);
          context.beginPath();
          context.arc(finaleX + Math.cos(ang) * distance, finaleY + Math.sin(ang) * distance * 0.72, particleSize, 0, Math.PI * 2);
          context.fill();
        }
        context.restore();
      }
    }

    function draw() {
      if (destroyed || !pageVisible) {
        rafId = 0;
        return;
      }
      var now = getNow();
      var fps = !state.active && !state.locking ? 5 : state.reducedMotion ? Math.min(15, maxFramesPerSecond) : maxFramesPerSecond;
      if (now - lastRenderedAt < 1000 / Math.max(1, fps)) {
        rafId = requestFrame(draw);
        return;
      }
      var deltaMs = Math.max(0, now - lastFrameAt);
      lastFrameAt = now;
      lastRenderedAt = now;
      var field = getField();
      var policy = motionPolicy(state.reducedMotion);
      var elapsedSeconds = (now - startedAt) / 1000;

      if (state.explorationEnabled && !state.targetRevealed && targetMotion) {
        var proximity = getProximity();
        var dwell = advanceDiscoveryDwell(dwellMs, {
          deltaMs: deltaMs,
          roundElapsedMs: now - startedAt,
          probeInside: probeInside,
          insideRevealRadius: proximity ? proximity.insideRevealRadius : false,
        });
        dwellMs = dwell.dwellMs;
        if (now - startedAt >= MIN_DISCOVERY_MS && dwell.discovered && !discoveryNotified) {
          discoveryNotified = true;
          if (onDiscovery) onDiscovery();
        }
      }

      if (targetMotion && state.targetRevealed && !state.locking) {
        if (field.kind === "fan") {
          targetMotion = advanceTargetMotion(targetMotion, field, targetDisplayRadius, elapsedSeconds, state.placementSeed, policy.driftSpeed);
        } else {
          var driftAngle = elapsedSeconds * 0.22 * policy.driftSpeed + state.placementSeed * 0.7;
          var driftRadius = 6 + Math.sin(elapsedSeconds * 0.31 * policy.driftSpeed + state.placementSeed) * 4;
          targetMotion = {
            position: NS.clampTargetInScanField(
              {
                x: targetMotion.position.x + Math.cos(driftAngle) * driftRadius * 0.016 * policy.driftSpeed,
                y: targetMotion.position.y + Math.sin(driftAngle * 0.9) * driftRadius * 0.012 * policy.driftSpeed,
              },
              field,
              targetDisplayRadius,
            ),
            clarityBoost: Math.max(0, targetMotion.clarityBoost * 0.92),
          };
        }
      }

      context.clearRect(0, 0, cssWidth, cssHeight);
      context.save();
      clipScanField(field);
      drawNoiseLayer(field, policy.textureMotion);
      drawTextureLayer(field, policy.textureMotion, probe.textureOffsetX, probe.textureOffsetY);
      if (state.explorationEnabled) drawSpotlight(field, policy.textureMotion);

      var beamAngle = 0;
      var scanLineY = 0;
      if (field.kind === "fan") {
        var beamBase = field.startAngle + field.sweep * 0.5;
        var beamWobble = Math.sin(frame * 0.04 * policy.textureMotion) * (field.sweep * 0.35);
        beamAngle = beamBase + beamWobble + probe.scanLineBias * field.sweep * 0.25;
        if (state.active) {
          context.save();
          context.translate(field.cx, field.cy);
          context.rotate(beamAngle);
          context.beginPath();
          context.moveTo(0, 0);
          context.lineTo(0, -field.radius);
          context.strokeStyle = "rgba(74, 222, 128, 0.85)";
          context.lineWidth = 3;
          context.stroke();
          context.restore();
        }
      } else {
        var sweep = 0.5 + Math.sin(frame * 0.04 * policy.textureMotion) * 0.42 + probe.scanLineBias * 0.12;
        scanLineY = field.y + Math.min(0.94, Math.max(0.06, sweep)) * field.height;
        if (state.active) {
          context.save();
          context.beginPath();
          context.moveTo(field.x, scanLineY);
          context.lineTo(field.x + field.width, scanLineY);
          context.strokeStyle = "rgba(74, 222, 128, 0.85)";
          context.lineWidth = 3;
          context.stroke();
          context.restore();
        }
      }

      if (targetMotion && state.targetRevealed) {
        var boost = field.kind === "fan"
          ? scanLineCrossBoost(beamAngle, targetMotion.position, field)
          : Math.max(0, 1 - Math.abs(targetMotion.position.y - scanLineY) / 14);
        targetMotion = { position: targetMotion.position, clarityBoost: Math.min(1, Math.max(targetMotion.clarityBoost, boost)) };
        var reveal = state.revealProgress / policy.revealDurationScale + (state.locking ? 0.25 : 0);
        var prox = getProximity();
        var spotlightHovered = state.locking || (probeInside && prox && prox.distance <= spotlightRadius);
        if (state.locking && lockStartedAt !== null) {
          drawLockFinale(field, targetMotion, clamp01((now - lockStartedAt) / LOCK_DELAY_MS));
        } else {
          drawTarget(targetMotion, Math.min(1, reveal), spotlightHovered);
        }
      }
      context.restore();

      context.save();
      context.beginPath();
      if (field.kind === "rect") {
        context.moveTo(field.x, field.y);
        context.lineTo(field.x + field.width, field.y);
        context.lineTo(field.x + field.width, field.y + field.height);
        context.lineTo(field.x, field.y + field.height);
        context.closePath();
        context.fillStyle = "rgba(34, 197, 94, 0.12)";
        context.fill();
      } else {
        context.moveTo(field.cx, field.cy);
        context.arc(field.cx, field.cy, field.radius, field.startAngle, field.startAngle + field.sweep);
        context.closePath();
        var gradient = context.createRadialGradient(field.cx, field.cy, field.radius * 0.1, field.cx, field.cy, field.radius);
        gradient.addColorStop(0, "rgba(34, 197, 94, 0.35)");
        gradient.addColorStop(0.55, "rgba(34, 197, 94, 0.12)");
        gradient.addColorStop(1, "rgba(34, 197, 94, 0.02)");
        context.fillStyle = gradient;
        context.fill();
      }
      context.strokeStyle = "rgba(34, 197, 94, 0.55)";
      context.lineWidth = 2;
      context.stroke();
      context.restore();

      if (state.showLockFrame && targetMotion) {
        context.save();
        clipScanField(field);
        context.strokeStyle = "rgba(74, 222, 128, 0.9)";
        context.lineWidth = 3;
        context.strokeRect(
          targetMotion.position.x - targetDisplayRadius - 6,
          targetMotion.position.y - targetDisplayRadius - 6,
          targetDisplayRadius * 2 + 12,
          targetDisplayRadius * 2 + 12,
        );
        context.restore();
      }

      if (now - lastMetricsAt >= metricsIntervalMs) {
        lastMetricsAt = now;
        if (onMetrics) onMetrics(getMetrics());
      }
      frame += 1;
      rafId = requestFrame(draw);
    }

    return {
      start: function () {
        if (destroyed || started) return;
        started = true;
        startedAt = getNow();
        lastFrameAt = startedAt;
        lastRenderedAt = Number.NEGATIVE_INFINITY;
        resize(true);
        if (pageVisible) rafId = requestFrame(draw);
      },
      setPageVisible: function (visible) {
        if (destroyed || pageVisible === visible) return;
        pageVisible = visible;
        if (!visible) {
          hiddenAt = getNow();
          if (rafId) { cancelFrame(rafId); rafId = 0; }
          return;
        }
        var resumedAt = getNow();
        if (hiddenAt != null) {
          startedAt += Math.max(0, resumedAt - hiddenAt);
          hiddenAt = null;
        }
        lastFrameAt = resumedAt;
        lastRenderedAt = Number.NEGATIVE_INFINITY;
        if (started && !rafId) rafId = requestFrame(draw);
      },
      updateInput: function (clientX, clientY, timestamp) {
        var rect = getStageRect();
        var localPoint = { x: clientX - rect.left, y: clientY - rect.top };
        if (!NS.isPointInScanField(localPoint, getField())) {
          probeInside = false;
          return;
        }
        probeInside = true;
        probeHasEntered = true;
        probe = smoother.push({ x: localPoint.x, y: localPoint.y, timestamp: timestamp || getNow() }, rect.width, rect.height);
      },
      setState: function (patch) {
        var lockingStarted = patch.locking === true && !state.locking;
        var lockingEnded = patch.locking === false && state.locking;
        var seedChanged = patch.placementSeed !== undefined && patch.placementSeed !== state.placementSeed;
        var targetWasCancelled = state.targetRevealed && patch.targetRevealed === false;
        var key;
        for (key in patch) {
          if (Object.prototype.hasOwnProperty.call(patch, key)) state[key] = patch[key];
        }
        if (lockingStarted) lockStartedAt = getNow();
        else if (lockingEnded || seedChanged || targetWasCancelled) lockStartedAt = null;
        if (seedChanged || targetWasCancelled) resetTargetMotion();
        if (seedChanged) {
          startedAt = getNow();
          lastFrameAt = startedAt;
          lastRenderedAt = Number.NEGATIVE_INFINITY;
        }
        if (seedChanged || targetWasCancelled) {
          dwellMs = 0;
          discoveryNotified = false;
        }
        if (seedChanged) {
          smoother.reset();
          probe = neutralProbe();
          probeHasEntered = false;
          probeInside = false;
        }
      },
      resize: resize,
      destroy: function () {
        destroyed = true;
        started = false;
        if (rafId) { cancelFrame(rafId); rafId = 0; }
        smoother.reset();
        noiseTextures = [];
      },
      getMetrics: getMetrics,
      getTargetPosition: function () {
        return targetMotion ? { x: targetMotion.position.x, y: targetMotion.position.y } : null;
      },
    };
  };

  NS.createScanSoundscape = function () {
    var Ctor = global.AudioContext || global.webkitAudioContext;
    var context = null;
    var masterGain = null;
    var focusGain = null;
    var scanLayers = null;
    var unlocked = false;
    var soundEnabled = true;
    var scanActive = false;
    var scanPaused = false;
    var focusMuted = false;
    var probeVelocity = 0;
    var lastProximityBeepAt = Number.NEGATIVE_INFINITY;
    var targetCueGains = [];

    function ensureContext() {
      if (context || !Ctor) return context;
      try {
        context = new Ctor();
        masterGain = context.createGain();
        focusGain = context.createGain();
        focusGain.gain.value = 1;
        masterGain.gain.value = 0;
        focusGain.connect(masterGain);
        masterGain.connect(context.destination);
      } catch (err) {
        context = null;
      }
      return context;
    }

    function rampGain(gain, target) {
      if (!gain || !context) return;
      var param = gain.gain;
      var when = context.currentTime;
      param.cancelScheduledValues(when);
      param.setValueAtTime(param.value, when);
      param.linearRampToValueAtTime(target, when + SOUND_RAMP);
    }

    function effectiveAudible() {
      return unlocked && soundEnabled && scanActive && !scanPaused && !focusMuted;
    }

    function applyMaster() {
      rampGain(masterGain, effectiveAudible() ? SOUND_MASTER : 0);
    }

    function tearDownScanLayers() {
      if (!scanLayers) return;
      try {
        scanLayers.ambienceOscA.stop();
        scanLayers.ambienceOscB.stop();
        scanLayers.probeOsc.stop();
      } catch (err) {}
      scanLayers.ambienceOscA.disconnect();
      scanLayers.ambienceOscB.disconnect();
      scanLayers.ambienceMix.disconnect();
      scanLayers.probeOsc.disconnect();
      scanLayers.probeGain.disconnect();
      scanLayers = null;
    }

    function applyProbeVelocity() {
      if (!scanLayers || !context) return;
      var velocity = clamp01(probeVelocity);
      rampGain(scanLayers.probeGain, 0.008 + velocity * 0.028);
      scanLayers.probeOsc.frequency.setTargetAtTime(640 + velocity * 220, context.currentTime, 0.05);
    }

    function buildScanLayers() {
      tearDownScanLayers();
      if (!context || !focusGain) return;
      var ambienceMix = context.createGain();
      ambienceMix.gain.value = 0.035;
      var ambienceOscA = context.createOscillator();
      ambienceOscA.type = "sine";
      ambienceOscA.frequency.value = 58;
      var ambienceOscB = context.createOscillator();
      ambienceOscB.type = "triangle";
      ambienceOscB.frequency.value = 118;
      var probeOsc = context.createOscillator();
      probeOsc.type = "sine";
      probeOsc.frequency.value = 720;
      var probeGain = context.createGain();
      probeGain.gain.value = 0;
      ambienceOscA.connect(ambienceMix);
      ambienceOscB.connect(ambienceMix);
      ambienceMix.connect(focusGain);
      probeOsc.connect(probeGain);
      probeGain.connect(focusGain);
      var now = context.currentTime;
      ambienceOscA.start(now);
      ambienceOscB.start(now);
      probeOsc.start(now);
      scanLayers = {
        ambienceOscA: ambienceOscA,
        ambienceOscB: ambienceOscB,
        ambienceMix: ambienceMix,
        probeOsc: probeOsc,
        probeGain: probeGain,
      };
      applyProbeVelocity();
    }

    function playCue(frequencies, durationSeconds, peakGain, trackAsTargetCue, oscillatorType) {
      var ctx = ensureContext();
      if (!ctx || !focusGain || !effectiveAudible()) return;
      var now = ctx.currentTime;
      var cueMaster = ctx.createGain();
      cueMaster.gain.setValueAtTime(0, now);
      cueMaster.gain.linearRampToValueAtTime(peakGain, now + SOUND_RAMP);
      cueMaster.gain.linearRampToValueAtTime(0, now + durationSeconds);
      cueMaster.connect(focusGain);
      if (trackAsTargetCue) targetCueGains.push(cueMaster);
      frequencies.forEach(function (frequency, index) {
        var osc = ctx.createOscillator();
        osc.type = oscillatorType || "sine";
        osc.frequency.value = frequency;
        var toneGain = ctx.createGain();
        toneGain.gain.value = 1 / frequencies.length;
        osc.connect(toneGain);
        toneGain.connect(cueMaster);
        osc.start(now + index * 0.06);
        osc.stop(now + durationSeconds + 0.02);
      });
    }

    return {
      unlockFromUserGesture: function () {
        var ctx = ensureContext();
        if (!ctx) return Promise.resolve(false);
        var resume = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
        return resume.then(function () {
          unlocked = ctx.state === "running";
          applyMaster();
          return unlocked;
        }).catch(function () {
          unlocked = false;
          return false;
        });
      },
      setSoundEnabled: function (enabled) {
        soundEnabled = enabled;
        applyMaster();
      },
      setScanActive: function (active) {
        if (active === scanActive) return;
        scanActive = active;
        if (active) {
          if (ensureContext()) buildScanLayers();
        } else {
          tearDownScanLayers();
          probeVelocity = 0;
        }
        applyMaster();
      },
      setScanPaused: function (paused) {
        scanPaused = paused;
        applyMaster();
      },
      setProbeVelocity: function (normalized) {
        probeVelocity = clamp01(normalized);
        applyProbeVelocity();
      },
      setProximitySignal: function (normalized) {
        if (!context || !effectiveAudible()) return;
        var strength = clamp01(normalized);
        var intervalSeconds = 0.2 + (1 - strength);
        if (context.currentTime - lastProximityBeepAt + Number.EPSILON < intervalSeconds) return;
        lastProximityBeepAt = context.currentTime;
        playCue([440 + strength * 160], 0.1, 0.045, false, "sine");
      },
      notifyReveal: function () {
        playCue([523.25, 659.25], 0.28, 0.12, true, "sine");
      },
      notifyLock: function (targetId) {
        var profile = (NS.LOCK_CUE_PROFILES && NS.LOCK_CUE_PROFILES[targetId]) || {
          frequencies: [392, 523.25, 659.25],
          oscillatorType: "sine",
          durationSeconds: 0.6,
        };
        playCue(profile.frequencies, profile.durationSeconds, 0.11, true, profile.oscillatorType);
      },
      cancelTargetCues: function () {
        if (!context) {
          targetCueGains = [];
          return;
        }
        targetCueGains.forEach(function (gain) { rampGain(gain, 0); });
        targetCueGains = [];
      },
      handleWindowBlur: function () {
        focusMuted = true;
        applyMaster();
      },
      handleWindowFocus: function () {
        focusMuted = false;
        applyMaster();
      },
      dispose: function () {
        tearDownScanLayers();
        if (masterGain) { masterGain.disconnect(); masterGain = null; }
        if (focusGain) { focusGain.disconnect(); focusGain = null; }
        if (context) { void context.close(); context = null; }
        unlocked = false;
        scanActive = false;
      },
    };
  };

  NS.signalStrengthToProbeVelocity = function (signalStrength) {
    var base = 0.22;
    var span = 1 - base;
    if (span <= 0) return 0;
    return clamp01((signalStrength - base) / span);
  };

  NS.hashTargetSeed = function (targetId) {
    var hash = 0;
    var i;
    for (i = 0; i < targetId.length; i += 1) {
      hash = (hash << 5) - hash + targetId.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) + 1;
  };
})(window);
