import fs from "node:fs";

const CREATED_AT = "2026-09-18T00:00:00.000Z";

const room = (key, type, name, c0, c1, r0, r1) => ({ key, type, name, c0, c1, r0, r1 });

const layoutStudio = () => [
  room("main", "bedroom", "起居卧室", 0, 2, 0, 1),
  room("kitchen", "kitchen", "独立厨房", 0, 1, 1, 2),
  room("bath", "bathroom", "卫生间", 1, 2, 1, 2),
];

const layout1B1L = () => [
  room("living", "living_room", "客厅与餐区", 0, 1, 0, 2),
  room("bed1", "bedroom", "主卧室", 1, 2, 0, 1),
  room("kitchen", "kitchen", "厨房", 1, 2, 1, 2),
  room("hall", "hallway", "玄关与过道", 0, 1, 2, 3),
  room("bath", "bathroom", "卫生间", 1, 2, 2, 3),
];

const layout2B1L = () => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅与餐区", 1, 3, 0, 1),
  room("bed2", "bedroom", "次卧室", 0, 1, 1, 2),
  room("hall", "hallway", "玄关与过道", 1, 2, 1, 3),
  room("kitchen", "kitchen", "厨房", 2, 3, 1, 2),
  room("storage", "storage", "家政储物", 0, 1, 2, 3),
  room("bath", "bathroom", "卫生间", 2, 3, 2, 3),
];

const layout2B2L = (twoBath = false) => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅", 1, 3, 0, 1),
  room("bed2", "bedroom", "次卧室", 0, 1, 1, 2),
  room("dining", "dining_room", "餐厅", 1, 2, 1, 2),
  room("kitchen", "kitchen", "厨房", 2, 3, 1, 2),
  room("hall", "hallway", "玄关与过道", 0, 2, 2, 3),
  ...(twoBath
    ? [room("bath1", "bathroom", "主卫生间", 2, 3, 2, 2.5), room("bath2", "bathroom", "客卫生间", 2, 3, 2.5, 3)]
    : [room("bath", "bathroom", "卫生间", 2, 3, 2, 3)]),
];

const layout3B1L = () => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅与餐区", 1, 3, 0, 1),
  room("bed2", "bedroom", "次卧室一", 0, 1, 1, 2),
  room("hall", "hallway", "玄关与过道", 1, 2, 1, 3),
  room("bed3", "bedroom", "次卧室二", 2, 3, 1, 2),
  room("kitchen", "kitchen", "厨房", 0, 1, 2, 3),
  room("bath", "bathroom", "卫生间", 2, 3, 2, 3),
];

const layout3B2L = (twoBath = true) => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅", 1, 3, 0, 1),
  room("bed2", "bedroom", "次卧室一", 3, 4, 0, 1),
  room("bed3", "bedroom", "次卧室二", 0, 1, 1, 2),
  room("dining", "dining_room", "餐厅", 1, 3, 1, 2),
  room("balcony", "balcony", "景观阳台", 3, 4, 1, 2),
  room("kitchen", "kitchen", "厨房", 0, 1, 2, 4),
  room("hall", "hallway", "玄关与过道", 1, 3, 2, 4),
  ...(twoBath
    ? [room("bath1", "bathroom", "主卫生间", 3, 4, 2, 3), room("bath2", "bathroom", "客卫生间", 3, 4, 3, 4)]
    : [room("bath", "bathroom", "卫生间", 3, 4, 2, 4)]),
];

const layout4B2L = (twoBath = true) => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅", 1, 3, 0, 1),
  room("bed2", "bedroom", "次卧室一", 3, 4, 0, 1),
  room("bed3", "bedroom", "次卧室二", 0, 1, 1, 2),
  room("dining", "dining_room", "餐厅", 1, 3, 1, 2),
  room("bed4", "bedroom", "次卧室三", 3, 4, 1, 2),
  room("kitchen", "kitchen", "厨房", 0, 1, 2, 4),
  room("hall", "hallway", "玄关与过道", 1, 3, 2, 4),
  ...(twoBath
    ? [room("bath1", "bathroom", "主卫生间", 3, 4, 2, 3), room("bath2", "bathroom", "客卫生间", 3, 4, 3, 4)]
    : [room("bath", "bathroom", "卫生间", 3, 4, 2, 4)]),
];

const layout5B2L = () => [
  room("bed1", "bedroom", "主卧室", 0, 1, 0, 1),
  room("living", "living_room", "客厅", 1, 4, 0, 1),
  room("bed2", "bedroom", "次卧室一", 4, 5, 0, 1),
  room("bed3", "bedroom", "次卧室二", 0, 1, 1, 2),
  room("dining", "dining_room", "餐厅", 1, 3, 1, 2),
  room("bed4", "bedroom", "次卧室三", 3, 4, 1, 2),
  room("bed5", "bedroom", "书房/客卧", 4, 5, 1, 2),
  room("kitchen", "kitchen", "厨房", 0, 1, 2, 4),
  room("hall", "hallway", "玄关与过道", 1, 4, 2, 4),
  room("bath1", "bathroom", "主卫生间", 4, 5, 2, 3),
  room("bath2", "bathroom", "客卫生间", 4, 5, 3, 4),
];

const specs = [];
const addSeries = (prefix, count, names, widths, heights, layout, notes) => {
  for (let i = 0; i < count; i++) {
    specs.push({
      id: `${prefix}-${String(i + 1).padStart(2, "0")}`,
      constName: `${prefix.replaceAll("-", "_").toUpperCase()}_${String(i + 1).padStart(2, "0")}`,
      name: names[i],
      widths: widths[i],
      heights: heights[i],
      rooms: layout(i),
      mirrorX: i % 2 === 1,
      description: notes[i],
    });
  }
};

addSeries(
  "floor-plan-cn-studio",
  3,
  ["紧凑开间 26m²", "长租公寓开间 30m²", "带独立厨房开间 34m²"],
  [[2700, 2100], [2800, 2200], [3000, 2400]],
  [[3500, 2100], [3800, 2200], [4000, 2300]],
  () => layoutStudio(),
  ["适合单人居住的最小完整套型，起居与睡眠复合使用。", "面向长租公寓的方正开间，厨卫集中布置。", "较宽开间提供完整收纳墙与独立烹饪空间。"],
);

addSeries(
  "floor-plan-cn-1b1l",
  6,
  ["紧凑一室一厅 38m²", "南向一室一厅 42m²", "通廊一室一厅 46m²", "方正一室一厅 49m²", "带家政区一室一厅 53m²", "舒适一室一厅 57m²"],
  [[3600, 2400], [3800, 2500], [4000, 2600], [4200, 2600], [4300, 2800], [4500, 2800]],
  [[2400, 2300, 1600], [2500, 2400, 1700], [2600, 2500, 1800], [2700, 2500, 1800], [2800, 2600, 1800], [2900, 2700, 1800]],
  () => layout1B1L(),
  ["小面积刚需原型，客餐合一并压缩交通面积。", "主要居室朝向同一采光面，适合中间户。", "玄关通廊串联厨卫与起居空间。", "开间与进深均衡，家具布置余量较好。", "入口侧设置可兼家政与储物的过渡区域。", "面向改善型单身或两人家庭的宽厅一居。"],
);

addSeries(
  "floor-plan-cn-2b1l",
  6,
  ["经济型两室一厅 58m²", "老城更新两室一厅 63m²", "紧凑两室一厅 67m²", "南北两室一厅 72m²", "双卧分离两室一厅 76m²", "舒适两室一厅 81m²"],
  [[2600, 2600, 2300], [2700, 2800, 2400], [2800, 2900, 2400], [2900, 3000, 2500], [3000, 3100, 2500], [3100, 3200, 2600]],
  [[2800, 2500, 2000], [2900, 2600, 2000], [3000, 2600, 2000], [3100, 2700, 2000], [3200, 2700, 2100], [3300, 2800, 2100]],
  () => layout2B1L(),
  ["保障房与首置家庭常见的两卧客餐合一原型。", "适合老旧住宅更新的紧凑三开间组织。", "压缩走道后形成完整双卧与独立厨房。", "双卧分居采光面两侧，利于家庭作息分离。", "两间卧室保持距离，兼顾父母与儿童居住。", "尺度更宽松的两室一厅，附家政储物空间。"],
);

addSeries(
  "floor-plan-cn-2b2l",
  6,
  ["紧凑两室两厅 76m²", "横厅两室两厅 82m²", "南北通透两室两厅 87m²", "边户两室两厅 92m²", "双卫两室两厅 97m²", "改善型两室两厅 103m²"],
  [[2800, 3000, 2400], [2900, 3200, 2500], [3000, 3300, 2600], [3100, 3400, 2600], [3200, 3500, 2700], [3300, 3600, 2800]],
  [[3200, 3000, 2200], [3300, 3100, 2200], [3400, 3200, 2200], [3500, 3200, 2300], [3600, 3300, 2300], [3700, 3400, 2300]],
  (i) => layout2B2L(i === 4),
  ["首改常见原型，客厅与餐厅相邻但功能独立。", "客餐空间横向展开，形成较宽公共界面。", "主要房间分列两侧，公共区贯通组织。", "增加侧向采光条件的边户型原型。", "以双卫生间提升两代同住的使用效率。", "较大客餐厅与完整玄关构成舒适两居。"],
);

addSeries(
  "floor-plan-cn-3b1l",
  6,
  ["紧凑三室一厅 82m²", "经济三室一厅 88m²", "刚需三室一厅 94m²", "双面采光三室一厅 99m²", "三代同堂三室一厅 105m²", "舒适三室一厅 111m²"],
  [[2800, 3100, 2700], [2900, 3200, 2800], [3000, 3300, 2900], [3100, 3400, 3000], [3200, 3500, 3100], [3300, 3600, 3200]],
  [[3500, 3300, 2700], [3600, 3400, 2700], [3700, 3500, 2700], [3800, 3600, 2700], [3900, 3700, 2700], [4000, 3800, 2700]],
  () => layout3B1L(),
  ["以较小总面积容纳三卧，适合首置多孩家庭。", "卧室尺度均衡、公共厅紧凑的经济型方案。", "常见刚需三房，客餐区复合使用。", "端部房间获得双面外墙，适合边户条件。", "三卧分散布置，支持三代人的不同作息。", "加宽公共空间并保留完整储物界面。"],
);

addSeries(
  "floor-plan-cn-3b2l",
  6,
  ["紧凑三室两厅双卫 98m²", "南北通透三室两厅 106m²", "横厅三室两厅 114m²", "景观阳台三室两厅 121m²", "边户三室两厅 128m²", "改善三室两厅 136m²"],
  [[2700, 2800, 2800, 2500], [2800, 2900, 2900, 2600], [2900, 3000, 3000, 2700], [3000, 3100, 3100, 2800], [3100, 3200, 3200, 2900], [3200, 3300, 3300, 3000]],
  [[3000, 2800, 1800, 1800], [3100, 2900, 1900, 1900], [3200, 3000, 2000, 2000], [3300, 3100, 2100, 2100], [3400, 3200, 2200, 2200], [3500, 3300, 2300, 2300]],
  () => layout3B2L(true),
  ["百平方米级刚改三房，双卫与独立餐厅齐全。", "公共区贯通南北两侧，形成对流通风路径。", "宽面客厅与餐厅连成家庭核心空间。", "景观阳台之外预留生活阳台功能位置。", "侧向外墙增加卧室与公共区采光机会。", "放大主卧、客餐厅和服务空间的改善型三房。"],
);

addSeries(
  "floor-plan-cn-4b2l",
  6,
  ["紧凑四室两厅双卫 126m²", "三代同堂四室两厅 136m²", "横厅四室两厅 146m²", "双卫四室两厅 156m²", "大面宽四室两厅 168m²", "改善四室两厅 180m²"],
  [[3000, 3100, 3100, 2800], [3100, 3200, 3200, 2900], [3200, 3300, 3300, 3000], [3300, 3400, 3400, 3100], [3400, 3500, 3500, 3200], [3500, 3600, 3600, 3300]],
  [[3400, 3200, 2100, 2100], [3500, 3300, 2200, 2200], [3600, 3400, 2300, 2300], [3700, 3500, 2400, 2400], [3800, 3600, 2500, 2500], [3900, 3700, 2600, 2600]],
  () => layout4B2L(true),
  ["控制总面积的四卧双卫方案，适合多孩家庭。", "四间卧室分布在公共区两侧，支持三代同住。", "客厅与餐厅形成连续横向公共空间。", "可将相邻卫生间分别服务主卧与家庭成员。", "四开间朝向主要采光面的大面宽原型。", "公共空间、卧室尺度和收纳均较充裕。"],
);

addSeries(
  "floor-plan-cn-5b2l",
  3,
  ["三代同堂五室两厅 166m²", "大平层五室两厅 190m²", "改善五室两厅 218m²"],
  [[3000, 3200, 3200, 3000, 2800], [3300, 3500, 3500, 3200, 3000], [3600, 3800, 3800, 3400, 3200]],
  [[3600, 3400, 2200, 2200], [3900, 3700, 2500, 2500], [4200, 4000, 2800, 2800]],
  () => layout5B2L(),
  ["为三代同堂设置五个可独立使用的睡眠或工作房间。", "以大横厅组织五房，适合多人家庭与居家办公。", "大尺度五房双厅双卫原型，可继续扩展套房系统。"],
);

const sum = (values, end) => values.slice(0, end).reduce((a, b) => a + b, 0);
const normalizeIndex = (n, len) => Math.round(n) === n ? sum(len, n) : sum(len, Math.floor(n)) + len[Math.floor(n)] * (n % 1);

function materialize(spec) {
  const width = sum(spec.widths, spec.widths.length);
  const height = sum(spec.heights, spec.heights.length);
  const rawRooms = spec.rooms.map((r) => {
    let x1 = normalizeIndex(r.c0, spec.widths);
    let x2 = normalizeIndex(r.c1, spec.widths);
    if (spec.mirrorX) [x1, x2] = [width - x2, width - x1];
    return { ...r, x1, x2, y1: normalizeIndex(r.r0, spec.heights), y2: normalizeIndex(r.r1, spec.heights) };
  });

  const horizontal = new Map();
  const vertical = new Map();
  for (const r of rawRooms) {
    for (const y of [r.y1, r.y2]) {
      if (!horizontal.has(y)) horizontal.set(y, new Set());
      horizontal.get(y).add(r.x1); horizontal.get(y).add(r.x2);
    }
    for (const x of [r.x1, r.x2]) {
      if (!vertical.has(x)) vertical.set(x, new Set());
      vertical.get(x).add(r.y1); vertical.get(x).add(r.y2);
    }
  }
  for (const [y, xs] of horizontal) {
    for (const r of rawRooms) if ((r.y1 === y || r.y2 === y)) { xs.add(r.x1); xs.add(r.x2); }
  }
  for (const [x, ys] of vertical) {
    for (const r of rawRooms) if ((r.x1 === x || r.x2 === x)) { ys.add(r.y1); ys.add(r.y2); }
  }

  const segments = [];
  for (const [y, xsSet] of horizontal) {
    const xs = [...xsSet].sort((a, b) => a - b);
    for (let i = 0; i < xs.length - 1; i++) {
      const x1 = xs[i], x2 = xs[i + 1];
      const used = rawRooms.some((r) => (r.y1 === y || r.y2 === y) && x1 >= r.x1 && x2 <= r.x2);
      if (used) segments.push({ x1, y1: y, x2, y2: y });
    }
  }
  for (const [x, ysSet] of vertical) {
    const ys = [...ysSet].sort((a, b) => a - b);
    for (let i = 0; i < ys.length - 1; i++) {
      const y1 = ys[i], y2 = ys[i + 1];
      const used = rawRooms.some((r) => (r.x1 === x || r.x2 === x) && y1 >= r.y1 && y2 <= r.y2);
      if (used) segments.push({ x1: x, y1, x2: x, y2 });
    }
  }

  const vertexMap = new Map();
  const vertices = [];
  const vertexId = (x, y) => {
    const key = `${x},${y}`;
    if (!vertexMap.has(key)) {
      const id = `v${vertices.length + 1}`;
      vertexMap.set(key, id); vertices.push({ id, x, y });
    }
    return vertexMap.get(key);
  };
  const walls = segments.map((s, i) => ({
    id: `w${i + 1}`,
    from: vertexId(s.x1, s.y1),
    to: vertexId(s.x2, s.y2),
    thickness: (s.x1 === 0 && s.x2 === 0) || (s.x1 === width && s.x2 === width) || (s.y1 === 0 && s.y2 === 0) || (s.y1 === height && s.y2 === height) ? 200 : 120,
    lockAxis: s.y1 === s.y2 ? "horizontal" : "vertical",
    _s: s,
  }));

  const boundaryIds = (r) => walls.filter(({ _s: s }) =>
    ((s.y1 === r.y1 || s.y1 === r.y2) && s.y1 === s.y2 && s.x1 >= r.x1 && s.x2 <= r.x2) ||
    ((s.x1 === r.x1 || s.x1 === r.x2) && s.x1 === s.x2 && s.y1 >= r.y1 && s.y2 <= r.y2)
  ).map((w) => w.id);

  const rooms = rawRooms.map((r, i) => ({ id: `r${i + 1}`, type: r.type, name: r.name, boundaryWallIds: boundaryIds(r), _r: r }));
  const wallLength = (w) => Math.abs(w._s.x2 - w._s.x1) + Math.abs(w._s.y2 - w._s.y1);
  const isOuter = (w) => w.thickness === 200;
  const sharedWall = (a, b) => walls.find((w) => a.boundaryWallIds.includes(w.id) && b.boundaryWallIds.includes(w.id) && wallLength(w) >= 1200);
  const openings = [];
  const connected = new Set();
  let root = rooms.find((r) => r.type === "hallway") || rooms.find((r) => r.type === "living_room") || rooms[0];
  connected.add(root.id);
  while (connected.size < rooms.length) {
    let choice;
    for (const a of rooms.filter((r) => connected.has(r.id))) {
      for (const b of rooms.filter((r) => !connected.has(r.id))) {
        const w = sharedWall(a, b);
        if (w) { choice = { b, w }; break; }
      }
      if (choice) break;
    }
    if (!choice) break;
    openings.push({ id: `d${openings.length + 2}`, type: "door", wallId: choice.w.id, position: 0.5, width: choice.b.type === "bathroom" ? 800 : 900, height: 2100 });
    connected.add(choice.b.id);
  }
  const entryWall = walls.find((w) => root.boundaryWallIds.includes(w.id) && isOuter(w) && wallLength(w) >= 1400)
    || walls.find((w) => rooms.find((r) => r.type === "living_room")?.boundaryWallIds.includes(w.id) && isOuter(w) && wallLength(w) >= 1400)
    || walls.find((w) => isOuter(w) && wallLength(w) >= 1400);
  openings.unshift({ id: "d1", type: "door", wallId: entryWall.id, position: 0.25, width: 900, height: 2100 });
  let win = 1;
  for (const r of rooms.filter((x) => ["bedroom", "living_room", "dining_room", "kitchen"].includes(x.type))) {
    const eligible = walls.filter((w) => r.boundaryWallIds.includes(w.id) && isOuter(w) && w.id !== entryWall.id && wallLength(w) >= 1600);
    if (!eligible.length) continue;
    const w = eligible.sort((a, b) => wallLength(b) - wallLength(a))[0];
    if (openings.some((o) => o.wallId === w.id && o.type === "window")) continue;
    openings.push({ id: `win${win++}`, type: "window", wallId: w.id, position: 0.5, width: Math.min(r.type === "living_room" ? 2400 : 1800, wallLength(w) - 400), height: 1400 });
  }

  const furniture = [];
  for (const r of rooms) {
    const rr = r._r;
    const rw = rr.x2 - rr.x1, rh = rr.y2 - rr.y1;
    const cx = Math.round((rr.x1 + rr.x2) / 2), cy = Math.round((rr.y1 + rr.y2) / 2);
    if (r.type === "bedroom") {
      const bedW = Math.min(1500, Math.max(1200, rw - 700));
      const bedD = Math.min(2000, Math.max(1800, rh - 700));
      furniture.push({ id: `f${furniture.length + 1}`, definitionId: "bed-queen", x: cx, y: cy, width: bedW, depth: bedD, rotation: rw >= rh ? 90 : 0 });
      if (Math.max(rw, rh) >= 2800) furniture.push({ id: `f${furniture.length + 1}`, definitionId: "wardrobe-large", x: rr.x2 - 400, y: rr.y2 - 400, width: Math.min(1800, Math.max(1200, rw - 800)), depth: 600, rotation: 180 });
    }
    if (r.type === "living_room") {
      furniture.push({ id: `f${furniture.length + 1}`, definitionId: "sofa-2seat", x: rr.x1 + Math.min(1200, rw / 3), y: cy, width: Math.min(1800, rw - 800), depth: 850, rotation: 0 });
      furniture.push({ id: `f${furniture.length + 1}`, definitionId: "tv-bench", x: rr.x2 - 450, y: cy, width: Math.min(1800, rw - 800), depth: 400, rotation: 180 });
    }
  }
  const area = Math.round(width * height / 1e6);
  return {
    version: 1,
    unit: "mm",
    meta: { id: spec.id, name: spec.name.replace(/\d+m²$/, `${area}m²`), source: "template", isStandard: true, createdAt: CREATED_AT, updatedAt: CREATED_AT, description: spec.description },
    vertices,
    walls: walls.map(({ _s, ...w }) => w),
    openings,
    rooms: rooms.map(({ _r, ...r }) => r),
    furniture,
  };
}

const plans = specs.map((s) => ({ spec: s, plan: materialize(s) }));

function validate(plan) {
  const errors = [];
  const vertexIds = new Set(plan.vertices.map((x) => x.id));
  const wallIds = new Set(plan.walls.map((x) => x.id));
  const openingIds = new Set(plan.openings.map((x) => x.id));
  const roomIds = new Set(plan.rooms.map((x) => x.id));
  const furnitureIds = new Set(plan.furniture.map((x) => x.id));
  const vertexById = new Map(plan.vertices.map((x) => [x.id, x]));
  const wallById = new Map(plan.walls.map((x) => [x.id, x]));
  if (vertexIds.size !== plan.vertices.length) errors.push("duplicate vertex id");
  if (wallIds.size !== plan.walls.length) errors.push("duplicate wall id");
  if (openingIds.size !== plan.openings.length) errors.push("duplicate opening id");
  if (roomIds.size !== plan.rooms.length) errors.push("duplicate room id");
  if (furnitureIds.size !== plan.furniture.length) errors.push("duplicate furniture id");
  for (const w of plan.walls) if (!vertexIds.has(w.from) || !vertexIds.has(w.to)) errors.push(`invalid wall vertices ${w.id}`);
  for (const o of plan.openings) {
    if (!wallIds.has(o.wallId)) { errors.push(`invalid opening wall ${o.id}`); continue; }
    const w = wallById.get(o.wallId);
    const a = vertexById.get(w.from), b = vertexById.get(w.to);
    const length = Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    if (o.width > length) errors.push(`opening wider than wall ${o.id}`);
    if (o.position < 0 || o.position > 1) errors.push(`invalid opening position ${o.id}`);
  }
  for (const r of plan.rooms) {
    if (r.boundaryWallIds.length < 4) errors.push(`incomplete room boundary ${r.id}`);
    for (const id of r.boundaryWallIds) if (!wallIds.has(id)) errors.push(`invalid room wall ${r.id}/${id}`);
  }
  if (!plan.openings.some((o) => o.type === "door")) errors.push("missing door");
  if (!plan.openings.some((o) => o.type === "window")) errors.push("missing window");
  return errors;
}

for (const { plan } of plans) {
  const errors = validate(plan);
  if (errors.length) throw new Error(`${plan.meta.id}: ${errors.join(", ")}`);
}

const header = `import type { StandardFloorPlan } from "@/lib/floor-plan/types";\n\n/**\n * 中国城市住宅代表性标准户型（标准化重绘）\n+ * 生成日期：2026-09-18\n+ *\n+ * 注意：这些是根据公开规范和常见商品住宅/保障房空间组织归纳的“原型”，\n+ * 不是施工图，也不对应某一个具体楼盘。实际项目须由有资质的建筑专业人员复核。\n+ */\n\n`;
const blocks = `import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";\nimport { STUDIO_STANDARD_FLOOR_PLAN, THREE_BED_STANDARD_FLOOR_PLAN } from "./fixtures/standard-plans";\n\n${plans.map(({ spec, plan }) => `export const ${spec.constName}: StandardFloorPlan = ${JSON.stringify(plan, null, 2)};`).join("\n\n")}`;
const index = `\n\nexport const FLOOR_PLAN_CATALOG_DATA: readonly StandardFloorPlan[] = [\n  VALID_STANDARD_FLOOR_PLAN,\n  STUDIO_STANDARD_FLOOR_PLAN,\n  THREE_BED_STANDARD_FLOOR_PLAN,\n${plans.map(({ spec }) => `  ${spec.constName},`).join("\n")}\n];\n`;
fs.writeFileSync(new URL("../../lib/floor-plan/catalog-data.ts", import.meta.url), header + blocks + index);
console.log(`Generated ${plans.length} plans`);
