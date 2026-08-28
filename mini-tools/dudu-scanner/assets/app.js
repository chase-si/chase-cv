(function () {
  var NS = window.DuduScanner;
  var MODE_COPY = {
    operator: { name: "成人协助模式", description: "游戏开始前，由成人指定角色。" },
    mystery: { name: "神秘扫描", description: "扫描仪会为这一轮悄悄选择一个角色。" },
    custom: { name: "自定义扫描", description: "上传自己的图片，扫描时把它们找出来。" },
  };
  var STATUS_COPY = {
    initializing: "正在初始化扫描仪…",
    moveProbe: "移动探头寻找信号",
    probeOutside: "探头已离开扫描区域",
    signalWeak: "信号微弱——继续寻找",
    signalMedium: "信号正在增强",
    signalStrong: "信号强烈——请保持探头稳定",
    signalDetected: "已检测到信号",
    targetReady: "目标已显形——可以锁定",
    mysteryReady: "未知信号已稳定——锁定后揭晓身份",
    locking: "正在锁定画面…",
  };

  var state = NS.createInitialRoundState();
  var config = { scanMode: "operator", targetId: "fry-sprite", soundEnabled: true };
  var roundAsset = null;
  var revealProgress = 0;
  var revealEpoch = 0;
  var metrics = { signalStrength: 0, signalBand: "weak", probeInside: false, probeHasEntered: false, gain: 0.42, scanFrequencyHz: 0.9 };
  var renderer = null;
  var soundscape = NS.createScanSoundscape();
  var customItems = [];
  var selectedCustomId = null;
  var lastRevealed = false;
  var lastLocking = false;
  var timers = { auto: 0, lock: 0, transient: 0, revealRaf: 0, hud: 0, finale: 0, how: 0 };
  var reducedMotion = false;
  var targetImage = null;
  var speaking = false;

  var els = {
    config: document.getElementById("view-config"),
    scan: document.getElementById("view-scan"),
    result: document.getElementById("view-result"),
    start: document.getElementById("btn-start-scan"),
    modeGrid: document.getElementById("mode-grid"),
    targetGrid: document.getElementById("target-grid"),
    operatorTargets: document.getElementById("operator-targets"),
    mysterySummary: document.getElementById("mystery-summary"),
    customPanel: document.getElementById("custom-panel"),
    customFile: document.getElementById("custom-file"),
    customThumbs: document.getElementById("custom-thumbs"),
    customNotice: document.getElementById("custom-notice"),
    startBlocked: document.getElementById("start-blocked"),
    soundToggle: document.getElementById("sound-toggle"),
    assetWarning: document.getElementById("asset-warning"),
    stage: document.getElementById("fan-stage"),
    canvas: document.getElementById("scan-canvas"),
    scanStatus: document.getElementById("scan-status"),
    lockHint: document.getElementById("lock-hint"),
    finale: document.getElementById("finale-copy"),
    finaleName: document.getElementById("finale-name"),
    finaleLine: document.getElementById("finale-line"),
    transient: document.getElementById("transient"),
    hudSignal: document.getElementById("hud-signal"),
    hudProgress: document.getElementById("hud-progress"),
    hudGain: document.getElementById("hud-gain"),
    hudFreq: document.getElementById("hud-freq"),
    hudTime: document.getElementById("hud-time"),
    hudBolt: document.getElementById("hud-bolt"),
    operatorBar: document.getElementById("operator-bar"),
    pauseBtn: document.getElementById("btn-pause"),
    revealHideBtn: document.getElementById("btn-reveal-hide"),
    resultImage: document.getElementById("result-image"),
    resultName: document.getElementById("result-name"),
    resultDesc: document.getElementById("result-desc"),
    healthBox: document.getElementById("health-box"),
    healthText: document.getElementById("health-text"),
    discovery: document.getElementById("discovery-progress"),
    bridgeNotice: document.getElementById("bridge-notice"),
    howProbe: document.getElementById("how-probe"),
    howSpark: document.getElementById("how-spark"),
    howStatus: document.getElementById("how-status"),
    howSteps: document.getElementById("how-steps"),
  };

  function dispatch(action) {
    state = NS.roundReducer(state, action);
    onStateChanged(action);
  }

  function prefersTouch() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches ||
      window.matchMedia("(max-width: 1023px)").matches;
  }

  function getMiniTool() {
    return window.xhs && window.xhs.miniTool ? window.xhs.miniTool : null;
  }

  function readDiscoveries() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(NS.DISCOVERY_STORAGE_KEY) || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (id) { return NS.TARGET_IDS.indexOf(id) !== -1; });
    } catch (err) {
      return [];
    }
  }

  function addDiscovery(targetId) {
    var next = readDiscoveries();
    if (next.indexOf(targetId) === -1) {
      next.push(targetId);
      window.localStorage.setItem(NS.DISCOVERY_STORAGE_KEY, JSON.stringify(next));
    }
  }

  function preloadImage(src) {
    return new Promise(function (resolve) {
      var image = new Image();
      image.onload = function () {
        targetImage = image;
        resolve(true);
      };
      image.onerror = function () {
        targetImage = null;
        resolve(false);
      };
      image.src = src;
    });
  }

  function getStageRect() {
    var stage = els.stage;
    var box = stage.getBoundingClientRect();
    return new DOMRect(
      box.left + stage.clientLeft,
      box.top + stage.clientTop,
      stage.clientWidth || box.width,
      stage.clientHeight || box.height,
    );
  }

  function destroyRenderer() {
    if (renderer) {
      renderer.destroy();
      renderer = null;
    }
  }

  function ensureRenderer() {
    if (renderer) return renderer;
    var coarse = window.matchMedia("(pointer: coarse)").matches;
    renderer = NS.createScannerVisualRenderer({
      canvas: els.canvas,
      getStageRect: getStageRect,
      getTargetImage: function () { return targetImage; },
      spotlightRadius: coarse ? NS.MOBILE_SPOTLIGHT : NS.DESKTOP_SPOTLIGHT,
      regionShape: (coarse || window.matchMedia("(max-width: 1023px)").matches) ? "rect" : "fan",
      onDiscovery: function () { dispatch({ type: "DISCOVER_TARGET" }); },
      onMetrics: function (next) {
        metrics = next;
        soundscape.setProbeVelocity(NS.signalStrengthToProbeVelocity(next.signalStrength));
        soundscape.setProximitySignal(next.signalStrength);
        updateHud();
      },
    });
    renderer.start();
    renderer.setPageVisible(!document.hidden);
    return renderer;
  }

  function syncRendererState() {
    if (!renderer || !roundAsset) return;
    var scan = state.scan;
    renderer.setState({
      active: !scan.locking && !scan.paused,
      explorationEnabled: scan.stage !== "auto-scan" && scan.stage !== "idle" && !scan.paused && !scan.locking,
      showLockFrame: scan.locking,
      targetRevealed: scan.targetRevealed,
      revealProgress: scan.targetRevealed ? (scan.locking ? 1 : revealProgress) : 0,
      locking: scan.locking,
      mysteryMode: roundAsset.concealUntilLock,
      reducedMotion: reducedMotion,
      placementSeed: NS.hashTargetSeed(roundAsset.seedId) + scan.placementVersion * 97,
    });
  }

  function showView(name) {
    els.config.hidden = name !== "config";
    els.scan.hidden = name !== "scan";
    els.result.hidden = name !== "result";
  }

  function updateConfigUi() {
    var startBlocked = config.scanMode === "custom" && customItems.length === 0;
    els.start.disabled = startBlocked;
    els.startBlocked.hidden = !startBlocked;
    els.operatorTargets.hidden = config.scanMode !== "operator";
    els.mysterySummary.hidden = config.scanMode !== "mystery";
    els.customPanel.hidden = config.scanMode !== "custom";
    Array.prototype.forEach.call(els.modeGrid.querySelectorAll(".mode-btn"), function (btn) {
      btn.classList.toggle("is-selected", btn.getAttribute("data-mode") === config.scanMode);
    });
    Array.prototype.forEach.call(els.targetGrid.querySelectorAll(".target-btn"), function (btn) {
      btn.classList.toggle("is-selected", btn.getAttribute("data-target") === config.targetId);
    });
  }

  function renderModes() {
    els.modeGrid.innerHTML = "";
    ["operator", "mystery", "custom"].forEach(function (mode) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "mode-btn" + (config.scanMode === mode ? " is-selected" : "");
      btn.setAttribute("data-mode", mode);
      btn.innerHTML = "<strong>" + MODE_COPY[mode].name + "</strong><small>" + MODE_COPY[mode].description + "</small>";
      btn.addEventListener("click", function () {
        config.scanMode = mode;
        updateConfigUi();
      });
      els.modeGrid.appendChild(btn);
    });
  }

  function renderTargets() {
    els.targetGrid.innerHTML = "";
    NS.TARGET_IDS.forEach(function (id) {
      var rec = NS.getTarget(id);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "target-btn" + (config.targetId === id ? " is-selected" : "");
      btn.setAttribute("data-target", id);
      btn.setAttribute("aria-label", rec.name);
      var img = document.createElement("img");
      img.src = rec.imageSrc;
      img.alt = "";
      var span = document.createElement("span");
      span.textContent = rec.name;
      btn.appendChild(img);
      btn.appendChild(span);
      btn.addEventListener("click", function () {
        config.targetId = id;
        updateConfigUi();
      });
      els.targetGrid.appendChild(btn);
    });
  }

  function renderCustomThumbs() {
    els.customThumbs.innerHTML = "";
    customItems.forEach(function (item) {
      var wrap = document.createElement("div");
      wrap.className = "custom-thumb" + (selectedCustomId === item.id ? " is-selected" : "");
      var img = document.createElement("img");
      img.src = item.url;
      img.alt = "";
      var pick = document.createElement("button");
      pick.type = "button";
      pick.className = "btn btn-ghost";
      pick.style.width = "100%";
      pick.style.minHeight = "auto";
      pick.style.padding = "0";
      pick.appendChild(img);
      pick.addEventListener("click", function () {
        selectedCustomId = selectedCustomId === item.id ? null : item.id;
        renderCustomThumbs();
      });
      var remove = document.createElement("button");
      remove.type = "button";
      remove.className = "thumb-remove";
      remove.textContent = "×";
      remove.addEventListener("click", function (event) {
        event.stopPropagation();
        if (item.url.indexOf("blob:") === 0) URL.revokeObjectURL(item.url);
        customItems = customItems.filter(function (entry) { return entry.id !== item.id; });
        if (selectedCustomId === item.id) selectedCustomId = null;
        renderCustomThumbs();
        updateConfigUi();
      });
      wrap.appendChild(pick);
      wrap.appendChild(remove);
      els.customThumbs.appendChild(wrap);
    });
  }

  function formatHudTime() {
    return new Date().toISOString().slice(11, 19);
  }

  function statusText() {
    var scan = state.scan;
    if (scan.stage === "auto-scan") return STATUS_COPY.initializing;
    if (scan.stage === "signal-found") return STATUS_COPY.signalDetected;
    if (scan.locking) return STATUS_COPY.locking;
    if (scan.targetRevealed) {
      if (scan.revealComplete) {
        return roundAsset && roundAsset.concealUntilLock ? STATUS_COPY.mysteryReady : STATUS_COPY.targetReady;
      }
      return STATUS_COPY.signalDetected;
    }
    if (!metrics.probeInside) {
      return metrics.probeHasEntered ? STATUS_COPY.probeOutside : STATUS_COPY.moveProbe;
    }
    if (metrics.signalBand === "strong") return STATUS_COPY.signalStrong;
    if (metrics.signalBand === "medium") return STATUS_COPY.signalMedium;
    return STATUS_COPY.signalWeak;
  }

  function updateHud() {
    if (state.phase !== "scan") return;
    var strength = state.scan.stage === "auto-scan" ? 0 : metrics.signalStrength;
    var percent = Math.round(strength * 100);
    els.scanStatus.textContent = statusText();
    els.hudSignal.textContent = percent + "%";
    els.hudProgress.style.width = percent + "%";
    els.hudGain.textContent = (state.scan.stage === "auto-scan" ? 0.42 : metrics.gain).toFixed(2);
    els.hudFreq.textContent = (state.scan.stage === "auto-scan" ? 0.9 : metrics.scanFrequencyHz).toFixed(2) + " Hz";
    els.hudTime.textContent = formatHudTime();
    els.hudBolt.classList.toggle("is-strong", strength >= 0.9);
    var showHint = state.scan.targetRevealed && state.scan.revealComplete && !state.scan.locking && !prefersTouch();
    els.lockHint.hidden = !showHint;
    els.operatorBar.hidden = !prefersTouch();
    els.pauseBtn.textContent = state.scan.paused ? "继续扫描" : "暂停扫描";
    els.revealHideBtn.textContent = state.scan.targetRevealed ? "隐藏目标" : "强制发现";
    els.revealHideBtn.setAttribute(
      "data-cmd",
      state.scan.targetRevealed ? "CANCEL_TARGET" : "FORCE_DISCOVERY",
    );
  }

  function clearTimers() {
    window.clearTimeout(timers.auto);
    window.clearTimeout(timers.lock);
    window.clearTimeout(timers.transient);
    window.clearTimeout(timers.finale);
    window.cancelAnimationFrame(timers.revealRaf);
  }

  function startRevealTicker() {
    window.cancelAnimationFrame(timers.revealRaf);
    if (!state.scan.targetRevealed || state.scan.locking || state.scan.paused) return;
    var epoch = revealEpoch;
    var started = performance.now();
    function tick(now) {
      if (epoch !== revealEpoch) return;
      revealProgress = Math.min(1, (now - started) / NS.REVEAL_DURATION_MS);
      syncRendererState();
      if (revealProgress < 1) {
        timers.revealRaf = window.requestAnimationFrame(tick);
      } else {
        dispatch({ type: "REVEAL_COMPLETE" });
      }
    }
    timers.revealRaf = window.requestAnimationFrame(tick);
  }

  function schedulePhaseTimers() {
    window.clearTimeout(timers.auto);
    window.clearTimeout(timers.lock);
    window.clearTimeout(timers.transient);
    if (state.phase === "scan" && state.scan.stage === "auto-scan") {
      timers.auto = window.setTimeout(function () { dispatch({ type: "AUTO_SCAN_COMPLETE" }); }, NS.AUTO_SCAN_MS);
    }
    if (state.phase === "scan" && state.scan.stage === "signal-found") {
      dispatch({ type: "BEGIN_TARGET_REVEAL" });
      return;
    }
    if (state.scan.locking) {
      timers.lock = window.setTimeout(function () { dispatch({ type: "LOCK_COMPLETE" }); }, NS.LOCK_DELAY_MS);
    }
    if (state.transient) {
      timers.transient = window.setTimeout(function () { dispatch({ type: "CLEAR_TRANSIENT" }); }, NS.TRANSIENT_MS);
    }
  }

  function resolveRoundTarget(excludeId) {
    if (config.scanMode === "mystery") return NS.pickMysteryTarget(excludeId);
    return config.targetId;
  }

  function pickCustom(excludeId) {
    if (selectedCustomId) {
      var selected = customItems.filter(function (item) { return item.id === selectedCustomId; })[0];
      if (selected) return selected;
    }
    var pool = customItems.filter(function (item) { return item.id !== excludeId; });
    if (!pool.length) pool = customItems.slice();
    return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
  }

  function prepareCatalogRound(excludeId) {
    var targetId = resolveRoundTarget(excludeId);
    var rec = NS.getTarget(targetId);
    return preloadImage(rec.imageSrc).then(function (ok) {
      roundAsset = {
        kind: "catalog",
        targetId: targetId,
        seedId: targetId,
        displaySrc: rec.imageSrc,
        concealUntilLock: config.scanMode === "mystery",
      };
      els.assetWarning.hidden = ok;
      return ok;
    });
  }

  function prepareCustomRound(excludeId) {
    var item = pickCustom(excludeId);
    if (!item) return Promise.resolve(false);
    return preloadImage(item.url).then(function (ok) {
      roundAsset = {
        kind: "custom",
        targetId: config.targetId,
        customAssetId: item.id,
        seedId: item.id,
        displaySrc: item.url,
        concealUntilLock: selectedCustomId !== item.id,
      };
      els.assetWarning.hidden = ok;
      return ok;
    });
  }

  function startScan(fromResult) {
    revealEpoch += 1;
    revealProgress = 0;
    var prep = config.scanMode === "custom"
      ? prepareCustomRound(fromResult && roundAsset ? roundAsset.customAssetId : null)
      : prepareCatalogRound(fromResult && roundAsset ? roundAsset.targetId : null);
    return prep.then(function (ok) {
      if (config.scanMode === "custom" && !ok && !roundAsset) return;
      lastRevealed = false;
      lastLocking = false;
      dispatch({ type: fromResult ? "SCAN_AGAIN" : "START_SCAN" });
      soundscape.unlockFromUserGesture();
    });
  }

  function returnToConfig() {
    revealEpoch += 1;
    revealProgress = 0;
    roundAsset = null;
    destroyRenderer();
    soundscape.setScanActive(false);
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    dispatch({ type: state.phase === "result" ? "CHANGE_TARGET" : "RETURN_TO_CONFIG" });
  }

  function applyCommand(type) {
    if (type === "TOGGLE_SOUND") {
      config.soundEnabled = !config.soundEnabled;
      els.soundToggle.checked = config.soundEnabled;
      soundscape.setSoundEnabled(config.soundEnabled);
      return;
    }
    if (state.phase !== "scan") return;
    var actionType = type === "FORCE_DISCOVERY" ? "DISCOVER_TARGET" : type;
    if (type === "RESTART_SCAN") {
      revealEpoch += 1;
      revealProgress = 0;
      soundscape.unlockFromUserGesture();
    }
    if (type === "CANCEL_TARGET") {
      revealEpoch += 1;
      revealProgress = 0;
      soundscape.cancelTargetCues();
    }
    dispatch({ type: actionType });
  }

  function captureResultDataUrl() {
    var card = document.getElementById("result-card");
    var canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 900;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#f2f1e6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "bold 36px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("肚肚扫描仪", 360, 70);
    ctx.font = "28px sans-serif";
    ctx.fillText(els.resultName.textContent, 360, 120);
    if (targetImage) ctx.drawImage(targetImage, 160, 160, 400, 400);
    ctx.font = "22px sans-serif";
    ctx.fillStyle = "#444";
    wrapText(ctx, els.healthText.textContent || "", 360, 620, 560, 32);
    void card;
    return canvas.toDataURL("image/png");
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var chars = (text || "").split("");
    var line = "";
    var i;
    var drawY = y;
    for (i = 0; i < chars.length; i += 1) {
      var test = line + chars[i];
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, drawY);
        line = chars[i];
        drawY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, drawY);
  }

  function showBridgeNotice(text) {
    els.bridgeNotice.hidden = false;
    els.bridgeNotice.textContent = text;
  }

  function renderResult() {
    if (!roundAsset) return;
    els.resultImage.src = roundAsset.displaySrc;
    if (roundAsset.kind === "custom") {
      els.resultName.textContent = "上传的图片";
      els.resultDesc.textContent = "";
      els.healthBox.hidden = true;
      els.discovery.hidden = true;
    } else {
      var rec = NS.getTarget(roundAsset.targetId);
      els.resultName.textContent = rec.name;
      els.resultDesc.textContent = rec.description;
      els.healthText.textContent = rec.suggestion;
      els.healthBox.hidden = false;
      addDiscovery(roundAsset.targetId);
      var count = readDiscoveries().length;
      els.discovery.hidden = false;
      els.discovery.textContent = "已认识 " + count + "/" + NS.TARGET_IDS.length + " 位肚肚朋友，再扫一次，遇见下一位！";
    }
    els.bridgeNotice.hidden = true;
    var mini = getMiniTool();
    document.getElementById("btn-save-album").hidden = !mini;
    document.getElementById("btn-post-note").hidden = !mini;
  }

  function onStateChanged(action) {
    showView(state.phase);
    if (state.phase === "config") {
      destroyRenderer();
      soundscape.setScanActive(false);
      updateConfigUi();
      return;
    }
    if (state.phase === "scan") {
      ensureRenderer();
      window.requestAnimationFrame(function () {
        if (renderer) renderer.resize(true);
        syncRendererState();
      });
      syncRendererState();
      soundscape.setScanActive(true);
      soundscape.setScanPaused(state.scan.paused);
      soundscape.setSoundEnabled(config.soundEnabled);
      if (state.scan.targetRevealed && !lastRevealed) soundscape.notifyReveal();
      if (state.scan.locking && !lastLocking) {
        soundscape.notifyLock(roundAsset && roundAsset.kind === "catalog" ? roundAsset.targetId : undefined);
        window.clearTimeout(timers.finale);
        timers.finale = window.setTimeout(function () {
          if (!roundAsset) return;
          var rec = roundAsset.kind === "catalog" ? NS.getTarget(roundAsset.targetId) : null;
          els.finaleName.textContent = rec ? rec.name : "自定义图片";
          els.finaleLine.textContent = rec ? "“" + rec.revealLine + "”" : "“就是你上传的那张图！”";
          els.finale.hidden = false;
        }, reducedMotion ? 0 : 1100);
      }
      if (!state.scan.locking) els.finale.hidden = true;
      lastRevealed = state.scan.targetRevealed;
      lastLocking = state.scan.locking;
      els.transient.hidden = !state.transient;
      els.transient.textContent = state.transient === "no-signal"
        ? "没有可锁定的信号——请移动探头，或点「强制发现」。"
        : "";
      updateHud();
      if (action && (action.type === "START_SCAN" || action.type === "SCAN_AGAIN" || action.type === "RESTART_SCAN" || action.type === "BEGIN_TARGET_REVEAL" || action.type === "TOGGLE_PAUSE" || action.type === "CANCEL_TARGET" || action.type === "LOCK_SIGNAL" || action.type === "DISCOVER_TARGET" || action.type === "AUTO_SCAN_COMPLETE")) {
        schedulePhaseTimers();
        startRevealTicker();
      }
      return;
    }
    if (state.phase === "result") {
      destroyRenderer();
      soundscape.setScanActive(false);
      renderResult();
    }
  }

  function bindScanInput() {
    var stage = els.stage;
    function onMove(event) {
      if (renderer) renderer.updateInput(event.clientX, event.clientY, event.timeStamp);
    }
    function onDown(event) {
      if (stage.setPointerCapture) stage.setPointerCapture(event.pointerId);
      onMove(event);
    }
    function onUp(event) {
      if (stage.hasPointerCapture && stage.hasPointerCapture(event.pointerId)) {
        stage.releasePointerCapture(event.pointerId);
      }
    }
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("pointerup", onUp);
    stage.addEventListener("pointercancel", onUp);
    stage.addEventListener("dblclick", function (event) {
      if (!renderer) return;
      renderer.updateInput(event.clientX, event.clientY, event.timeStamp);
      if (NS.isDoubleClickLockEligible(state.scan.targetRevealed, renderer.getMetrics().signalStrength)) {
        applyCommand("LOCK_SIGNAL");
      }
    });
  }

  function startHowDemo() {
    var phase = 0;
    function paint() {
      var steps = els.howSteps.querySelectorAll("li");
      Array.prototype.forEach.call(steps, function (li, index) {
        li.classList.toggle("is-active", index === phase);
      });
      els.howProbe.classList.toggle("is-scan", phase > 0);
      els.howSpark.classList.toggle("is-found", phase === 2);
      els.howStatus.textContent = phase === 2 ? "发现信号" : "寻找信号";
    }
    paint();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timers.how = window.setInterval(function () {
      phase = (phase + 1) % 3;
      paint();
    }, 1800);
  }

  els.start.addEventListener("click", function () { startScan(false); });
  document.getElementById("btn-scan-back").addEventListener("click", returnToConfig);
  document.getElementById("btn-result-back").addEventListener("click", returnToConfig);
  document.getElementById("btn-scan-again").addEventListener("click", function () { startScan(true); });
  document.getElementById("btn-change-target").addEventListener("click", returnToConfig);
  document.getElementById("btn-upload").addEventListener("click", function () { els.customFile.click(); });
  document.getElementById("btn-clear-custom").addEventListener("click", function () {
    if (!customItems.length) return;
    if (!window.confirm("清空已上传的图片？")) return;
    customItems.forEach(function (item) {
      if (item.url.indexOf("blob:") === 0) URL.revokeObjectURL(item.url);
    });
    customItems = [];
    selectedCustomId = null;
    renderCustomThumbs();
    updateConfigUi();
  });
  els.customFile.addEventListener("change", function () {
    var files = Array.prototype.slice.call(els.customFile.files || []);
    var skipped = "";
    files.forEach(function (file) {
      var type = (file.type || "").toLowerCase();
      if (customItems.length >= NS.CUSTOM_LIBRARY_MAX) {
        skipped = "最多保存 6 张，多出来的文件已跳过。";
        return;
      }
      if (type !== "image/png" && type !== "image/jpeg" && type !== "image/webp") {
        skipped = "请使用 PNG、JPEG 或 WebP。";
        return;
      }
      if (file.size > NS.CUSTOM_ASSET_MAX_BYTES) {
        skipped = "每张图片不能超过 2 MB。";
        return;
      }
      customItems.push({
        id: "custom-" + Date.now() + "-" + Math.random().toString(16).slice(2),
        url: URL.createObjectURL(file),
      });
    });
    els.customFile.value = "";
    els.customNotice.hidden = !skipped;
    els.customNotice.textContent = skipped;
    renderCustomThumbs();
    updateConfigUi();
  });
  els.soundToggle.addEventListener("change", function () {
    config.soundEnabled = els.soundToggle.checked;
    soundscape.setSoundEnabled(config.soundEnabled);
  });
  els.operatorBar.addEventListener("click", function (event) {
    var btn = event.target.closest("[data-cmd]");
    if (!btn) return;
    applyCommand(btn.getAttribute("data-cmd"));
  });
  document.getElementById("btn-speak").addEventListener("click", function () {
    if (!window.speechSynthesis) return;
    if (speaking || window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      speaking = false;
      this.textContent = "播放";
      return;
    }
    var utterance = new SpeechSynthesisUtterance(els.healthText.textContent);
    utterance.lang = "zh-CN";
    utterance.rate = 0.9;
    utterance.onend = function () { speaking = false; document.getElementById("btn-speak").textContent = "播放"; };
    utterance.onerror = utterance.onend;
    speaking = true;
    this.textContent = "停止";
    window.speechSynthesis.speak(utterance);
  });
  document.getElementById("btn-save-album").addEventListener("click", function () {
    var mini = getMiniTool();
    if (!mini) return;
    var data = captureResultDataUrl();
    mini.saveImageToPhotosAlbum({ filePath: data }).then(function () {
      showBridgeNotice("已保存到相册。");
    }).catch(function () {
      showBridgeNotice("保存失败，请检查相册权限后重试。");
    });
  });
  document.getElementById("btn-post-note").addEventListener("click", function () {
    var mini = getMiniTool();
    if (!mini) return;
    var data = captureResultDataUrl();
    var rec = roundAsset && roundAsset.kind === "catalog" ? NS.getTarget(roundAsset.targetId) : null;
    var title = rec ? rec.name.slice(0, 20) : "肚肚扫描";
    var content = rec ? (rec.name + "：" + rec.suggestion).slice(0, 1000) : "我刚完成一轮肚肚扫描！";
    mini.postNote({
      title: title,
      content: content,
      pageType: "photo_publish",
      mediaInfo: { image_resources: [{ url: data }] },
    }).then(function () {
      showBridgeNotice("已打开发笔记。");
    }).catch(function () {
      showBridgeNotice("发笔记失败，请稍后重试。");
    });
  });

  window.addEventListener("keydown", function (event) {
    if (event.target instanceof HTMLInputElement) return;
    var map = { " ": "FORCE_DISCOVERY", Enter: "LOCK_SIGNAL", r: "RESTART_SCAN", R: "RESTART_SCAN", m: "TOGGLE_SOUND", M: "TOGGLE_SOUND", x: "CANCEL_TARGET", X: "CANCEL_TARGET" };
    var cmd = map[event.key];
    if (!cmd) return;
    if (event.key === " ") event.preventDefault();
    applyCommand(cmd);
  });
  window.addEventListener("resize", function () {
    if (renderer) renderer.resize();
    updateHud();
  });
  document.addEventListener("visibilitychange", function () {
    if (renderer) renderer.setPageVisible(!document.hidden);
  });
  window.addEventListener("blur", function () { soundscape.handleWindowBlur(); });
  window.addEventListener("focus", function () { soundscape.handleWindowFocus(); });
  if (window.matchMedia) {
    var media = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion = media.matches;
    media.addEventListener("change", function () { reducedMotion = media.matches; syncRendererState(); });
  }

  bindScanInput();
  renderModes();
  renderTargets();
  updateConfigUi();
  showView("config");
  startHowDemo();
  window.setInterval(function () {
    if (state.phase === "scan") els.hudTime.textContent = formatHudTime();
  }, 1000);
})();
