// 中国代表性真实住宅户型数据集 — 50套
// 说明：source 字段按既有 StandardFloorPlan schema 固定为 "template"；真实来源见独立 research-manifest.json。
// 所有对象均为 raw StandardFloorPlan；无运行时布局生成器。
import type { StandardFloorPlan } from "@/lib/floor-plan/types";

// Stage 2 / Batch 01 — source-derived real Chinese residential floor plans.
// No geometry helper/template is used at runtime; each export is a raw StandardFloorPlan object.
// Coordinate convention: x increases rightward; y increases downward. boundaryWallIds follow visual clockwise order.

export const PLAN_CN_SH_RUIDONG_67: StandardFloorPlan = {
  version: 1,
  unit: "mm",
  meta: {
    id: "plan-cn-sh-ruidong-2br-67",
    name: "上海瑞冬小区两居室 67m²",
    source: "template",
    isStandard: true,
    createdAt: "2026-09-19T00:00:00.000Z",
    updatedAt: "2026-09-19T00:00:00.000Z",
    description: "基于上海瑞冬小区公开真实户型图按正交几何简化重建；67m²为来源标注建筑面积，不等同于本模型房间几何面积。保留厨房、两卧、客厅、卫生间、南向阳台及左侧入户凹口的主要相对关系。",
  },
  vertices: [
    { id: "v1", x: 700, y: 0 },
    { id: "v2", x: 2394, y: 0 },
    { id: "v3", x: 4996, y: 0 },
    { id: "v4", x: 700, y: 1600 },
    { id: "v5", x: 2394, y: 1600 },
    { id: "v6", x: 2394, y: 3345 },
    { id: "v7", x: 4996, y: 3345 },
    { id: "v8", x: 0, y: 3551 },
    { id: "v9", x: 700, y: 3551 },
    { id: "v10", x: 1511, y: 3551 },
    { id: "v11", x: 4996, y: 3551 },
    { id: "v12", x: 0, y: 6286 },
    { id: "v13", x: 1511, y: 6286 },
    { id: "v14", x: 4852, y: 6286 },
    { id: "v15", x: 4996, y: 6286 },
    { id: "v16", x: 1511, y: 10917 },
    { id: "v17", x: 4852, y: 10917 },
    { id: "v18", x: 1511, y: 12159 },
    { id: "v19", x: 4852, y: 12159 },
  ],
  walls: [
    { id: "w1", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
    { id: "w2", from: "v4", to: "v1", thickness: 200, lockAxis: "vertical" },
    { id: "w3", from: "v2", to: "v3", thickness: 200, lockAxis: "horizontal" },
    { id: "w4", from: "v2", to: "v5", thickness: 120, lockAxis: "vertical" },
    { id: "w5", from: "v3", to: "v7", thickness: 200, lockAxis: "vertical" },
    { id: "w6", from: "v5", to: "v4", thickness: 120, lockAxis: "horizontal" },
    { id: "w7", from: "v9", to: "v4", thickness: 200, lockAxis: "vertical" },
    { id: "w8", from: "v6", to: "v5", thickness: 120, lockAxis: "vertical" },
    { id: "w9", from: "v7", to: "v6", thickness: 120, lockAxis: "horizontal" },
    { id: "w10", from: "v7", to: "v11", thickness: 200, lockAxis: "vertical" },
    { id: "w11", from: "v8", to: "v9", thickness: 200, lockAxis: "horizontal" },
    { id: "w12", from: "v12", to: "v8", thickness: 200, lockAxis: "vertical" },
    { id: "w13", from: "v10", to: "v9", thickness: 120, lockAxis: "horizontal" },
    { id: "w14", from: "v13", to: "v10", thickness: 120, lockAxis: "vertical" },
    { id: "w15", from: "v11", to: "v15", thickness: 200, lockAxis: "vertical" },
    { id: "w16", from: "v13", to: "v12", thickness: 200, lockAxis: "horizontal" },
    { id: "w17", from: "v14", to: "v13", thickness: 120, lockAxis: "horizontal" },
    { id: "w18", from: "v16", to: "v13", thickness: 200, lockAxis: "vertical" },
    { id: "w19", from: "v15", to: "v14", thickness: 200, lockAxis: "horizontal" },
    { id: "w20", from: "v14", to: "v17", thickness: 200, lockAxis: "vertical" },
    { id: "w21", from: "v17", to: "v16", thickness: 120, lockAxis: "horizontal" },
    { id: "w22", from: "v18", to: "v16", thickness: 200, lockAxis: "vertical" },
    { id: "w23", from: "v17", to: "v19", thickness: 200, lockAxis: "vertical" },
    { id: "w24", from: "v19", to: "v18", thickness: 200, lockAxis: "horizontal" },
  ],
  openings: [
    { id: "d1", type: "door", wallId: "w7", position: 0.5, width: 900, height: 2100 },
    { id: "d2", type: "door", wallId: "w6", position: 0.5, width: 800, height: 2100 },
    { id: "d3", type: "door", wallId: "w9", position: 0.5, width: 800, height: 2100 },
    { id: "d4", type: "door", wallId: "w14", position: 0.5, width: 700, height: 2100 },
    { id: "d5", type: "door", wallId: "w17", position: 0.5, width: 850, height: 2100 },
    { id: "d6", type: "door", wallId: "w21", position: 0.5, width: 1800, height: 2200 },
    { id: "win1", type: "window", wallId: "w1", position: 0.5, width: 1000, height: 1200 },
    { id: "win2", type: "window", wallId: "w3", position: 0.5, width: 1400, height: 1500 },
    { id: "win3", type: "window", wallId: "w11", position: 0.5, width: 500, height: 900 },
    { id: "win4", type: "window", wallId: "w15", position: 0.5, width: 1200, height: 1500 },
    { id: "win5", type: "window", wallId: "w24", position: 0.5, width: 2000, height: 1500 },
  ],
  rooms: [
    { id: "r1", type: "kitchen", name: "厨房", boundaryWallIds: ["w1", "w4", "w6", "w2"] },
    { id: "r2", type: "bedroom", name: "次卧", boundaryWallIds: ["w3", "w5", "w9", "w8", "w4"] },
    { id: "r3", type: "living_room", name: "客厅与入户过渡区", boundaryWallIds: ["w6", "w8", "w9", "w10", "w15", "w19", "w17", "w14", "w13", "w7"] },
    { id: "r4", type: "bathroom", name: "卫生间", boundaryWallIds: ["w11", "w13", "w14", "w16", "w12"] },
    { id: "r5", type: "bedroom", name: "主卧", boundaryWallIds: ["w17", "w20", "w21", "w18"] },
    { id: "r6", type: "balcony", name: "阳台", boundaryWallIds: ["w21", "w23", "w24", "w22"] },
  ],
  furniture: [],
};

export const PLAN_CN_SZ_SHANYUEWAN_70B: StandardFloorPlan = {
  version: 1,
  unit: "mm",
  meta: {
    id: "plan-cn-sz-shanyuewan-70b-70",
    name: "深圳山樾湾 70B 两居室 70m²",
    source: "template",
    isStandard: true,
    createdAt: "2026-09-19T00:00:00.000Z",
    updatedAt: "2026-09-19T00:00:00.000Z",
    description: "基于深圳山樾湾70B公开开发商户型图按正交几何简化重建；70m²为来源标注建筑面积。模型保留左侧厨卫与卧室序列、右侧连续客餐厅/玄关、南端客厅阳台及明厨明卫关系。",
  },
  vertices: [
    { id: "v1", x: 0, y: 0 },
    { id: "v2", x: 3000, y: 0 },
    { id: "v3", x: 6200, y: 0 },
    { id: "v4", x: 0, y: 1933 },
    { id: "v5", x: 1000, y: 1933 },
    { id: "v6", x: 3000, y: 1933 },
    { id: "v7", x: 0, y: 3533 },
    { id: "v8", x: 1000, y: 3533 },
    { id: "v9", x: 3000, y: 3533 },
    { id: "v10", x: 0, y: 6000 },
    { id: "v11", x: 3000, y: 6000 },
    { id: "v12", x: 3000, y: 7000 },
    { id: "v13", x: 6200, y: 7000 },
    { id: "v14", x: 3000, y: 8625 },
    { id: "v15", x: 6200, y: 8625 },
    { id: "v16", x: 0, y: 9767 },
    { id: "v17", x: 3000, y: 9767 },
  ],
  walls: [
    { id: "w1", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
    { id: "w2", from: "v4", to: "v1", thickness: 200, lockAxis: "vertical" },
    { id: "w3", from: "v2", to: "v3", thickness: 200, lockAxis: "horizontal" },
    { id: "w4", from: "v2", to: "v6", thickness: 120, lockAxis: "vertical" },
    { id: "w5", from: "v3", to: "v13", thickness: 200, lockAxis: "vertical" },
    { id: "w6", from: "v5", to: "v4", thickness: 200, lockAxis: "horizontal" },
    { id: "w7", from: "v6", to: "v5", thickness: 120, lockAxis: "horizontal" },
    { id: "w8", from: "v8", to: "v5", thickness: 200, lockAxis: "vertical" },
    { id: "w9", from: "v6", to: "v9", thickness: 120, lockAxis: "vertical" },
    { id: "w10", from: "v7", to: "v8", thickness: 200, lockAxis: "horizontal" },
    { id: "w11", from: "v10", to: "v7", thickness: 200, lockAxis: "vertical" },
    { id: "w12", from: "v9", to: "v8", thickness: 120, lockAxis: "horizontal" },
    { id: "w13", from: "v9", to: "v11", thickness: 120, lockAxis: "vertical" },
    { id: "w14", from: "v11", to: "v10", thickness: 120, lockAxis: "horizontal" },
    { id: "w15", from: "v16", to: "v10", thickness: 200, lockAxis: "vertical" },
    { id: "w16", from: "v11", to: "v12", thickness: 120, lockAxis: "vertical" },
    { id: "w17", from: "v13", to: "v12", thickness: 120, lockAxis: "horizontal" },
    { id: "w18", from: "v12", to: "v14", thickness: 120, lockAxis: "vertical" },
    { id: "w19", from: "v13", to: "v15", thickness: 200, lockAxis: "vertical" },
    { id: "w20", from: "v15", to: "v14", thickness: 200, lockAxis: "horizontal" },
    { id: "w21", from: "v14", to: "v17", thickness: 200, lockAxis: "vertical" },
    { id: "w22", from: "v17", to: "v16", thickness: 200, lockAxis: "horizontal" },
  ],
  openings: [
    { id: "d1", type: "door", wallId: "w3", position: 0.5, width: 900, height: 2100 },
    { id: "d2", type: "door", wallId: "w4", position: 0.5, width: 800, height: 2100 },
    { id: "d3", type: "door", wallId: "w9", position: 0.5, width: 700, height: 2100 },
    { id: "d4", type: "door", wallId: "w13", position: 0.5, width: 800, height: 2100 },
    { id: "d5", type: "door", wallId: "w16", position: 0.5, width: 800, height: 2100 },
    { id: "d6", type: "door", wallId: "w17", position: 0.5, width: 1800, height: 2200 },
    { id: "win1", type: "window", wallId: "w1", position: 0.5, width: 1400, height: 1200 },
    { id: "win2", type: "window", wallId: "w8", position: 0.5, width: 800, height: 900 },
    { id: "win3", type: "window", wallId: "w11", position: 0.5, width: 1400, height: 1500 },
    { id: "win4", type: "window", wallId: "w15", position: 0.5, width: 1800, height: 1500 },
    { id: "win5", type: "window", wallId: "w5", position: 0.5, width: 2000, height: 1800 },
    { id: "win6", type: "window", wallId: "w20", position: 0.5, width: 2200, height: 1500 },
  ],
  rooms: [
    { id: "r1", type: "kitchen", name: "厨房", boundaryWallIds: ["w1", "w4", "w7", "w6", "w2"] },
    { id: "r2", type: "bathroom", name: "卫生间", boundaryWallIds: ["w7", "w9", "w12", "w8"] },
    { id: "r3", type: "bedroom", name: "次卧", boundaryWallIds: ["w10", "w12", "w13", "w14", "w11"] },
    { id: "r4", type: "bedroom", name: "主卧", boundaryWallIds: ["w14", "w16", "w18", "w21", "w22", "w15"] },
    { id: "r5", type: "living_room", name: "客餐厅与玄关", boundaryWallIds: ["w3", "w5", "w17", "w16", "w13", "w9", "w4"] },
    { id: "r6", type: "balcony", name: "客厅阳台", boundaryWallIds: ["w17", "w19", "w20", "w18"] },
  ],
  furniture: [],
};

export const PLAN_CN_BJ_ZHONGHAIHUIDELI_77: StandardFloorPlan = {
  version: 1,
  unit: "mm",
  meta: {
    id: "plan-cn-bj-zhonghaihuideli-2br-77-mid",
    name: "北京中海汇德里中间户 77m²",
    source: "template",
    isStandard: true,
    createdAt: "2026-09-19T00:00:00.000Z",
    updatedAt: "2026-09-19T00:00:00.000Z",
    description: "基于北京中海汇德里77m²中间户公开开发商户型图正交简化重建；来源同时标注建筑面积77m²、套内面积61.44m²。模型房间几何面积约61.08m²，接近来源套内面积，并保留北侧厨/次卧、南侧客厅/主卧、东侧公卫及独立入户缓冲的主要关系。",
  },
  vertices: [
    { id: "v1", x: 0, y: 0 },
    { id: "v2", x: 1820, y: 0 },
    { id: "v3", x: 3650, y: 0 },
    { id: "v4", x: 6240, y: 0 },
    { id: "v5", x: 3650, y: 3300 },
    { id: "v6", x: 5470, y: 3300 },
    { id: "v7", x: 6240, y: 3300 },
    { id: "v8", x: 0, y: 3450 },
    { id: "v9", x: 1820, y: 3450 },
    { id: "v10", x: 3550, y: 6000 },
    { id: "v11", x: 3650, y: 6000 },
    { id: "v12", x: 5470, y: 6000 },
    { id: "v13", x: 6430, y: 6000 },
    { id: "v14", x: 0, y: 10000 },
    { id: "v15", x: 3550, y: 10000 },
    { id: "v16", x: 6430, y: 10000 },
  ],
  walls: [
    { id: "w1", from: "v1", to: "v2", thickness: 200, lockAxis: "horizontal" },
    { id: "w2", from: "v8", to: "v1", thickness: 200, lockAxis: "vertical" },
    { id: "w3", from: "v2", to: "v3", thickness: 200, lockAxis: "horizontal" },
    { id: "w4", from: "v2", to: "v9", thickness: 120, lockAxis: "vertical" },
    { id: "w5", from: "v3", to: "v4", thickness: 200, lockAxis: "horizontal" },
    { id: "w6", from: "v5", to: "v3", thickness: 120, lockAxis: "vertical" },
    { id: "w7", from: "v4", to: "v7", thickness: 200, lockAxis: "vertical" },
    { id: "w8", from: "v6", to: "v5", thickness: 120, lockAxis: "horizontal" },
    { id: "w9", from: "v11", to: "v5", thickness: 120, lockAxis: "vertical" },
    { id: "w10", from: "v7", to: "v6", thickness: 200, lockAxis: "horizontal" },
    { id: "w11", from: "v6", to: "v12", thickness: 200, lockAxis: "vertical" },
    { id: "w12", from: "v9", to: "v8", thickness: 120, lockAxis: "horizontal" },
    { id: "w13", from: "v14", to: "v8", thickness: 200, lockAxis: "vertical" },
    { id: "w14", from: "v10", to: "v11", thickness: 120, lockAxis: "horizontal" },
    { id: "w15", from: "v15", to: "v10", thickness: 120, lockAxis: "vertical" },
    { id: "w16", from: "v12", to: "v11", thickness: 120, lockAxis: "horizontal" },
    { id: "w17", from: "v12", to: "v13", thickness: 200, lockAxis: "horizontal" },
    { id: "w18", from: "v13", to: "v16", thickness: 200, lockAxis: "vertical" },
    { id: "w19", from: "v15", to: "v14", thickness: 200, lockAxis: "horizontal" },
    { id: "w20", from: "v16", to: "v15", thickness: 200, lockAxis: "horizontal" },
  ],
  openings: [
    { id: "d1", type: "door", wallId: "w3", position: 0.5, width: 900, height: 2100 },
    { id: "d2", type: "door", wallId: "w4", position: 0.5, width: 800, height: 2100 },
    { id: "d3", type: "door", wallId: "w6", position: 0.5, width: 800, height: 2100 },
    { id: "d4", type: "door", wallId: "w9", position: 0.5, width: 700, height: 2100 },
    { id: "d5", type: "door", wallId: "w15", position: 0.5, width: 800, height: 2100 },
    { id: "win1", type: "window", wallId: "w1", position: 0.5, width: 1000, height: 1200 },
    { id: "win2", type: "window", wallId: "w5", position: 0.5, width: 1400, height: 1500 },
    { id: "win3", type: "window", wallId: "w11", position: 0.5, width: 800, height: 900 },
    { id: "win4", type: "window", wallId: "w19", position: 0.5, width: 2200, height: 1800 },
    { id: "win5", type: "window", wallId: "w20", position: 0.5, width: 1800, height: 1500 },
  ],
  rooms: [
    { id: "r1", type: "kitchen", name: "厨房", boundaryWallIds: ["w1", "w4", "w12", "w2"] },
    { id: "r2", type: "bedroom", name: "次卧", boundaryWallIds: ["w5", "w7", "w10", "w8", "w6"] },
    { id: "r3", type: "bathroom", name: "公卫", boundaryWallIds: ["w8", "w11", "w16", "w9"] },
    { id: "r4", type: "bedroom", name: "主卧", boundaryWallIds: ["w14", "w16", "w17", "w18", "w20", "w15"] },
    { id: "r5", type: "living_room", name: "客餐厅与玄关", boundaryWallIds: ["w3", "w6", "w9", "w14", "w15", "w19", "w13", "w12", "w4"] },
  ],
  furniture: [],
};

export const PLAN_CN_SZ_XINHEZIYOU_50: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sz-xinheziyou-1br-50",
    "name": "深圳信和自由广场 1室1厅1卫1厨 50m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于深圳信和自由广场公开真实户型资料按正交几何简化重建；50.00m²为来源标注建筑面积，不等同于房间几何面积。模型约37.95m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1390,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2940,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4660,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6160,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1650
    },
    {
      "id": "v7",
      "x": 1390,
      "y": 1650
    },
    {
      "id": "v8",
      "x": 2940,
      "y": 1650
    },
    {
      "id": "v9",
      "x": 6160,
      "y": 1650
    },
    {
      "id": "v10",
      "x": 0,
      "y": 3060
    },
    {
      "id": "v11",
      "x": 1390,
      "y": 3060
    },
    {
      "id": "v12",
      "x": 2940,
      "y": 3060
    },
    {
      "id": "v13",
      "x": 6160,
      "y": 3060
    },
    {
      "id": "v14",
      "x": 0,
      "y": 4560
    },
    {
      "id": "v15",
      "x": 2940,
      "y": 4560
    },
    {
      "id": "v16",
      "x": 4660,
      "y": 4560
    },
    {
      "id": "v17",
      "x": 6160,
      "y": 4560
    },
    {
      "id": "v18",
      "x": 0,
      "y": 6160
    },
    {
      "id": "v19",
      "x": 1390,
      "y": 6160
    },
    {
      "id": "v20",
      "x": 2940,
      "y": 6160
    },
    {
      "id": "v21",
      "x": 4660,
      "y": 6160
    },
    {
      "id": "v22",
      "x": 6160,
      "y": 6160
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v8",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v13",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v15",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v12",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v11",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v10",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v14",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v15",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v19",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 1540,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1540,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w19",
        "w17",
        "w16",
        "w14",
        "w20",
        "w21",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w15",
        "w16",
        "w17",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w13",
        "w12",
        "w24",
        "w25",
        "w26",
        "w20"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_JUNHAOGUOJI_40: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-junhaoguoji-1br-40",
    "name": "上海骏豪国际 1室1厅1卫1厨 40m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海骏豪国际公开真实户型资料按正交几何简化重建；40.00m²为来源标注建筑面积，不等同于房间几何面积。模型约24.10m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1040,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2210,
      "y": 0
    },
    {
      "id": "v4",
      "x": 3490,
      "y": 0
    },
    {
      "id": "v5",
      "x": 4620,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1160
    },
    {
      "id": "v7",
      "x": 3490,
      "y": 1160
    },
    {
      "id": "v8",
      "x": 4620,
      "y": 1160
    },
    {
      "id": "v9",
      "x": 0,
      "y": 2400
    },
    {
      "id": "v10",
      "x": 1040,
      "y": 2400
    },
    {
      "id": "v11",
      "x": 2210,
      "y": 2400
    },
    {
      "id": "v12",
      "x": 3490,
      "y": 2400
    },
    {
      "id": "v13",
      "x": 4620,
      "y": 2400
    },
    {
      "id": "v14",
      "x": 0,
      "y": 3460
    },
    {
      "id": "v15",
      "x": 1040,
      "y": 3460
    },
    {
      "id": "v16",
      "x": 2210,
      "y": 3460
    },
    {
      "id": "v17",
      "x": 4620,
      "y": 3460
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4590
    },
    {
      "id": "v19",
      "x": 1040,
      "y": 4590
    },
    {
      "id": "v20",
      "x": 2210,
      "y": 4590
    },
    {
      "id": "v21",
      "x": 3490,
      "y": 4590
    },
    {
      "id": "v22",
      "x": 4620,
      "y": 4590
    },
    {
      "id": "v23",
      "x": 2210,
      "y": 5790
    },
    {
      "id": "v24",
      "x": 3490,
      "y": 5790
    },
    {
      "id": "v25",
      "x": 4620,
      "y": 5790
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v11",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v9",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v13",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v20",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v16",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v14",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v19",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v18",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v22",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v25",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v24",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v23",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w12",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 1100,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1060,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1100,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 990,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w7",
        "w6",
        "w5"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w21",
        "w20",
        "w18",
        "w23",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w19",
        "w20",
        "w21",
        "w22"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w17",
        "w16",
        "w26",
        "w27",
        "w28",
        "w29"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_GERUIYAJU_50: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-geruiyaju-1br-50",
    "name": "北京格瑞雅居 1室1厅1卫1厨 50m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京格瑞雅居公开真实户型资料按正交几何简化重建；50.00m²为来源标注建筑面积，不等同于房间几何面积。模型约34.79m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1200,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2540,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4020,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5320,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1260
    },
    {
      "id": "v7",
      "x": 1200,
      "y": 1260
    },
    {
      "id": "v8",
      "x": 2540,
      "y": 1260
    },
    {
      "id": "v9",
      "x": 4020,
      "y": 1260
    },
    {
      "id": "v10",
      "x": 5320,
      "y": 1260
    },
    {
      "id": "v11",
      "x": 0,
      "y": 2600
    },
    {
      "id": "v12",
      "x": 1200,
      "y": 2600
    },
    {
      "id": "v13",
      "x": 2540,
      "y": 2600
    },
    {
      "id": "v14",
      "x": 5320,
      "y": 2600
    },
    {
      "id": "v15",
      "x": 0,
      "y": 4020
    },
    {
      "id": "v16",
      "x": 1200,
      "y": 4020
    },
    {
      "id": "v17",
      "x": 2540,
      "y": 4020
    },
    {
      "id": "v18",
      "x": 4020,
      "y": 4020
    },
    {
      "id": "v19",
      "x": 5320,
      "y": 4020
    },
    {
      "id": "v20",
      "x": 0,
      "y": 5240
    },
    {
      "id": "v21",
      "x": 2540,
      "y": 5240
    },
    {
      "id": "v22",
      "x": 4020,
      "y": 5240
    },
    {
      "id": "v23",
      "x": 5320,
      "y": 5240
    },
    {
      "id": "v24",
      "x": 0,
      "y": 6540
    },
    {
      "id": "v25",
      "x": 1200,
      "y": 6540
    },
    {
      "id": "v26",
      "x": 2540,
      "y": 6540
    },
    {
      "id": "v27",
      "x": 4020,
      "y": 6540
    },
    {
      "id": "v28",
      "x": 5320,
      "y": 6540
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v7",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v10",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v14",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v19",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v22",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v15",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v12",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v11",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v25",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v24",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v23",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 1120,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1240,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1160,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w5",
        "w4"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w24",
        "w18",
        "w17",
        "w16",
        "w15",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w7",
        "w6",
        "w22",
        "w21",
        "w20",
        "w23"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w14",
        "w30",
        "w31",
        "w32",
        "w26"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_JINDU_50: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-jindu-1br-50",
    "name": "成都锦都 1室1厅1卫1厨 50m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都锦都公开真实户型资料按正交几何简化重建；50.18m²为来源标注建筑面积，不等同于房间几何面积。模型约35.15m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1120,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2370,
      "y": 0
    },
    {
      "id": "v4",
      "x": 3760,
      "y": 0
    },
    {
      "id": "v5",
      "x": 4960,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6300,
      "y": 0
    },
    {
      "id": "v7",
      "x": 0,
      "y": 1360
    },
    {
      "id": "v8",
      "x": 3760,
      "y": 1360
    },
    {
      "id": "v9",
      "x": 6300,
      "y": 1360
    },
    {
      "id": "v10",
      "x": 0,
      "y": 2540
    },
    {
      "id": "v11",
      "x": 1120,
      "y": 2540
    },
    {
      "id": "v12",
      "x": 2370,
      "y": 2540
    },
    {
      "id": "v13",
      "x": 3760,
      "y": 2540
    },
    {
      "id": "v14",
      "x": 6300,
      "y": 2540
    },
    {
      "id": "v15",
      "x": 0,
      "y": 3790
    },
    {
      "id": "v16",
      "x": 1120,
      "y": 3790
    },
    {
      "id": "v17",
      "x": 2370,
      "y": 3790
    },
    {
      "id": "v18",
      "x": 4960,
      "y": 3790
    },
    {
      "id": "v19",
      "x": 6300,
      "y": 3790
    },
    {
      "id": "v20",
      "x": 0,
      "y": 5120
    },
    {
      "id": "v21",
      "x": 1120,
      "y": 5120
    },
    {
      "id": "v22",
      "x": 2370,
      "y": 5120
    },
    {
      "id": "v23",
      "x": 3760,
      "y": 5120
    },
    {
      "id": "v24",
      "x": 4960,
      "y": 5120
    },
    {
      "id": "v25",
      "x": 6300,
      "y": 5120
    },
    {
      "id": "v26",
      "x": 3760,
      "y": 6260
    },
    {
      "id": "v27",
      "x": 4960,
      "y": 6260
    },
    {
      "id": "v28",
      "x": 6300,
      "y": 6260
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v7",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v10",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v9",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v14",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v18",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v23",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v22",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v17",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v15",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v20",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v19",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v25",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v26",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 1160,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1210,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1210,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w6",
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w7"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w23",
        "w22",
        "w20",
        "w25",
        "w26",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w21",
        "w22",
        "w23",
        "w24"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w18",
        "w17",
        "w16"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_ZHONGTAITIANJING_50: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-zhongtaitianjing-1br-50",
    "name": "广州中泰天境 1室1厅1卫1厨 50m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州中泰天境公开真实户型资料按正交几何简化重建；50.00m²为来源标注建筑面积，不等同于房间几何面积。模型约38.02m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1190,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2530,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5290,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1370
    },
    {
      "id": "v7",
      "x": 1190,
      "y": 1370
    },
    {
      "id": "v8",
      "x": 2530,
      "y": 1370
    },
    {
      "id": "v9",
      "x": 5290,
      "y": 1370
    },
    {
      "id": "v10",
      "x": 0,
      "y": 2830
    },
    {
      "id": "v11",
      "x": 1190,
      "y": 2830
    },
    {
      "id": "v12",
      "x": 2530,
      "y": 2830
    },
    {
      "id": "v13",
      "x": 5290,
      "y": 2830
    },
    {
      "id": "v14",
      "x": 6720,
      "y": 2830
    },
    {
      "id": "v15",
      "x": 0,
      "y": 4080
    },
    {
      "id": "v16",
      "x": 1190,
      "y": 4080
    },
    {
      "id": "v17",
      "x": 2530,
      "y": 4080
    },
    {
      "id": "v18",
      "x": 4000,
      "y": 4080
    },
    {
      "id": "v19",
      "x": 5290,
      "y": 4080
    },
    {
      "id": "v20",
      "x": 6720,
      "y": 4080
    },
    {
      "id": "v21",
      "x": 0,
      "y": 5420
    },
    {
      "id": "v22",
      "x": 4000,
      "y": 5420
    },
    {
      "id": "v23",
      "x": 5290,
      "y": 5420
    },
    {
      "id": "v24",
      "x": 6720,
      "y": 5420
    },
    {
      "id": "v25",
      "x": 0,
      "y": 6830
    },
    {
      "id": "v26",
      "x": 1190,
      "y": 6830
    },
    {
      "id": "v27",
      "x": 2530,
      "y": 6830
    },
    {
      "id": "v28",
      "x": 4000,
      "y": 6830
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v8",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v12",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v13",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v19",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v23",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v22",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v15",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v14",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v24",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v21",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v25",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 1160,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1290,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w29",
      "position": 0.5,
      "width": 1290,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w7",
        "w3",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w27",
        "w18",
        "w17",
        "w16",
        "w15",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w7",
        "w21",
        "w20",
        "w22"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w23",
        "w24",
        "w25",
        "w13",
        "w12",
        "w26"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_BEIXINJIAYUAN_60: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-beixinjiayuan-2br-60",
    "name": "北京北新家园 2室1厅1卫1厨 60m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京北新家园公开真实户型资料按正交几何简化重建；60.00m²为来源标注建筑面积，不等同于房间几何面积。模型约45.56m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1190,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2530,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5290,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6710,
      "y": 0
    },
    {
      "id": "v7",
      "x": 7950,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1210
    },
    {
      "id": "v9",
      "x": 1190,
      "y": 1210
    },
    {
      "id": "v10",
      "x": 2530,
      "y": 1210
    },
    {
      "id": "v11",
      "x": 5290,
      "y": 1210
    },
    {
      "id": "v12",
      "x": 7950,
      "y": 1210
    },
    {
      "id": "v13",
      "x": 0,
      "y": 2510
    },
    {
      "id": "v14",
      "x": 1190,
      "y": 2510
    },
    {
      "id": "v15",
      "x": 2530,
      "y": 2510
    },
    {
      "id": "v16",
      "x": 5290,
      "y": 2510
    },
    {
      "id": "v17",
      "x": 6710,
      "y": 2510
    },
    {
      "id": "v18",
      "x": 7950,
      "y": 2510
    },
    {
      "id": "v19",
      "x": 0,
      "y": 3880
    },
    {
      "id": "v20",
      "x": 1190,
      "y": 3880
    },
    {
      "id": "v21",
      "x": 2530,
      "y": 3880
    },
    {
      "id": "v22",
      "x": 5290,
      "y": 3880
    },
    {
      "id": "v23",
      "x": 6710,
      "y": 3880
    },
    {
      "id": "v24",
      "x": 7950,
      "y": 3880
    },
    {
      "id": "v25",
      "x": 0,
      "y": 5330
    },
    {
      "id": "v26",
      "x": 2530,
      "y": 5330
    },
    {
      "id": "v27",
      "x": 4000,
      "y": 5330
    },
    {
      "id": "v28",
      "x": 5290,
      "y": 5330
    },
    {
      "id": "v29",
      "x": 6710,
      "y": 5330
    },
    {
      "id": "v30",
      "x": 7950,
      "y": 5330
    },
    {
      "id": "v31",
      "x": 0,
      "y": 6590
    },
    {
      "id": "v32",
      "x": 1190,
      "y": 6590
    },
    {
      "id": "v33",
      "x": 2530,
      "y": 6590
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v26",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v26",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 1270,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1290,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1270,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1240,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w31",
        "w21",
        "w20",
        "w19",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w26",
        "w27",
        "w28",
        "w29",
        "w12",
        "w11",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w25",
        "w24",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w15",
        "w14",
        "w36",
        "w37",
        "w38",
        "w16"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_NJ_MAQUNGONGYU_60: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-nj-maqungongyu-2br-60",
    "name": "南京马群公寓 2室1厅1卫1厨 60m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于南京马群公寓公开真实户型资料按正交几何简化重建；60.20m²为来源标注建筑面积，不等同于房间几何面积。模型约49.04m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1180,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2500,
      "y": 0
    },
    {
      "id": "v4",
      "x": 3960,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5230,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6650,
      "y": 0
    },
    {
      "id": "v7",
      "x": 7880,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1400
    },
    {
      "id": "v9",
      "x": 3960,
      "y": 1400
    },
    {
      "id": "v10",
      "x": 7880,
      "y": 1400
    },
    {
      "id": "v11",
      "x": 0,
      "y": 2600
    },
    {
      "id": "v12",
      "x": 1180,
      "y": 2600
    },
    {
      "id": "v13",
      "x": 2500,
      "y": 2600
    },
    {
      "id": "v14",
      "x": 3960,
      "y": 2600
    },
    {
      "id": "v15",
      "x": 7880,
      "y": 2600
    },
    {
      "id": "v16",
      "x": 0,
      "y": 3880
    },
    {
      "id": "v17",
      "x": 1180,
      "y": 3880
    },
    {
      "id": "v18",
      "x": 2500,
      "y": 3880
    },
    {
      "id": "v19",
      "x": 5230,
      "y": 3880
    },
    {
      "id": "v20",
      "x": 6650,
      "y": 3880
    },
    {
      "id": "v21",
      "x": 7880,
      "y": 3880
    },
    {
      "id": "v22",
      "x": 0,
      "y": 5240
    },
    {
      "id": "v23",
      "x": 1180,
      "y": 5240
    },
    {
      "id": "v24",
      "x": 2500,
      "y": 5240
    },
    {
      "id": "v25",
      "x": 3960,
      "y": 5240
    },
    {
      "id": "v26",
      "x": 5230,
      "y": 5240
    },
    {
      "id": "v27",
      "x": 7880,
      "y": 5240
    },
    {
      "id": "v28",
      "x": 2500,
      "y": 6680
    },
    {
      "id": "v29",
      "x": 3960,
      "y": 6680
    },
    {
      "id": "v30",
      "x": 5230,
      "y": 6680
    },
    {
      "id": "v31",
      "x": 6650,
      "y": 6680
    },
    {
      "id": "v32",
      "x": 7880,
      "y": 6680
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v10",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v15",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v19",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v16",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v24",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v23",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v22",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v21",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v27",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v28",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 1280,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1240,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1260,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1280,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w29",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w25",
        "w24",
        "w22",
        "w27",
        "w28",
        "w29"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w19",
        "w18",
        "w17",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w24",
        "w25",
        "w26"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w21",
        "w20",
        "w34",
        "w35",
        "w36",
        "w37"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_GUIXIANSHANGPIN_60: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-guixianshangpin-2br-60",
    "name": "广州贵贤上品 2室1厅1卫1厨 60m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州贵贤上品公开真实户型资料按正交几何简化重建；60.00m²为来源标注建筑面积，不等同于房间几何面积。模型约46.95m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1190,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2520,
      "y": 0
    },
    {
      "id": "v4",
      "x": 3990,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5270,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6700,
      "y": 0
    },
    {
      "id": "v7",
      "x": 7930,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1330
    },
    {
      "id": "v9",
      "x": 1190,
      "y": 1330
    },
    {
      "id": "v10",
      "x": 2520,
      "y": 1330
    },
    {
      "id": "v11",
      "x": 5270,
      "y": 1330
    },
    {
      "id": "v12",
      "x": 7930,
      "y": 1330
    },
    {
      "id": "v13",
      "x": 0,
      "y": 2740
    },
    {
      "id": "v14",
      "x": 1190,
      "y": 2740
    },
    {
      "id": "v15",
      "x": 2520,
      "y": 2740
    },
    {
      "id": "v16",
      "x": 5270,
      "y": 2740
    },
    {
      "id": "v17",
      "x": 6700,
      "y": 2740
    },
    {
      "id": "v18",
      "x": 7930,
      "y": 2740
    },
    {
      "id": "v19",
      "x": 0,
      "y": 3950
    },
    {
      "id": "v20",
      "x": 1190,
      "y": 3950
    },
    {
      "id": "v21",
      "x": 2520,
      "y": 3950
    },
    {
      "id": "v22",
      "x": 3990,
      "y": 3950
    },
    {
      "id": "v23",
      "x": 5270,
      "y": 3950
    },
    {
      "id": "v24",
      "x": 6700,
      "y": 3950
    },
    {
      "id": "v25",
      "x": 7930,
      "y": 3950
    },
    {
      "id": "v26",
      "x": 0,
      "y": 5240
    },
    {
      "id": "v27",
      "x": 1190,
      "y": 5240
    },
    {
      "id": "v28",
      "x": 2520,
      "y": 5240
    },
    {
      "id": "v29",
      "x": 3990,
      "y": 5240
    },
    {
      "id": "v30",
      "x": 7930,
      "y": 5240
    },
    {
      "id": "v31",
      "x": 3990,
      "y": 6610
    },
    {
      "id": "v32",
      "x": 5270,
      "y": 6610
    },
    {
      "id": "v33",
      "x": 6700,
      "y": 6610
    },
    {
      "id": "v34",
      "x": 7930,
      "y": 6610
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v18",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v28",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v26",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v25",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v30",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v31",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 1150,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1290,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w37",
      "position": 0.5,
      "width": 1250,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1250,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w16",
        "w15",
        "w14",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w26",
        "w27",
        "w28",
        "w29",
        "w12",
        "w11",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w25",
        "w24",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w21",
        "w20",
        "w19",
        "w31",
        "w32",
        "w33"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_DUSHIFUYUAN_61: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-dushifuyuan-2br-61",
    "name": "上海都市富苑 2室1厅1卫1厨 61m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海都市富苑公开真实户型资料按正交几何简化重建；60.93m²为来源标注建筑面积，不等同于房间几何面积。模型约50.81m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1220,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2590,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4100,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5420,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6880,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8160,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1290
    },
    {
      "id": "v9",
      "x": 4100,
      "y": 1290
    },
    {
      "id": "v10",
      "x": 6880,
      "y": 1290
    },
    {
      "id": "v11",
      "x": 8160,
      "y": 1290
    },
    {
      "id": "v12",
      "x": 0,
      "y": 2650
    },
    {
      "id": "v13",
      "x": 1220,
      "y": 2650
    },
    {
      "id": "v14",
      "x": 2590,
      "y": 2650
    },
    {
      "id": "v15",
      "x": 4100,
      "y": 2650
    },
    {
      "id": "v16",
      "x": 6880,
      "y": 2650
    },
    {
      "id": "v17",
      "x": 8160,
      "y": 2650
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4100
    },
    {
      "id": "v19",
      "x": 1220,
      "y": 4100
    },
    {
      "id": "v20",
      "x": 2590,
      "y": 4100
    },
    {
      "id": "v21",
      "x": 6880,
      "y": 4100
    },
    {
      "id": "v22",
      "x": 8160,
      "y": 4100
    },
    {
      "id": "v23",
      "x": 0,
      "y": 5350
    },
    {
      "id": "v24",
      "x": 2590,
      "y": 5350
    },
    {
      "id": "v25",
      "x": 4100,
      "y": 5350
    },
    {
      "id": "v26",
      "x": 5420,
      "y": 5350
    },
    {
      "id": "v27",
      "x": 6880,
      "y": 5350
    },
    {
      "id": "v28",
      "x": 8160,
      "y": 5350
    },
    {
      "id": "v29",
      "x": 0,
      "y": 6670
    },
    {
      "id": "v30",
      "x": 1220,
      "y": 6670
    },
    {
      "id": "v31",
      "x": 2590,
      "y": 6670
    },
    {
      "id": "v32",
      "x": 4100,
      "y": 6670
    },
    {
      "id": "v33",
      "x": 5420,
      "y": 6670
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v26",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 1330,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1280,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1330,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1190,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w16",
        "w15",
        "w14",
        "w13",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w31",
        "w29",
        "w28",
        "w22",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w21",
        "w20",
        "w36",
        "w37",
        "w38",
        "w32"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_TJ_ZHONGYUANLI_70: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-tj-zhongyuanli-2br-70",
    "name": "天津中远里 2室1厅1卫1厨 70m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于天津中远里公开真实户型资料按正交几何简化重建；70.23m²为来源标注建筑面积，不等同于房间几何面积。模型约55.54m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1260,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2670,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4230,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5590,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7090,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8400,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1540
    },
    {
      "id": "v9",
      "x": 2670,
      "y": 1540
    },
    {
      "id": "v10",
      "x": 7090,
      "y": 1540
    },
    {
      "id": "v11",
      "x": 8400,
      "y": 1540
    },
    {
      "id": "v12",
      "x": 0,
      "y": 2860
    },
    {
      "id": "v13",
      "x": 1260,
      "y": 2860
    },
    {
      "id": "v14",
      "x": 2670,
      "y": 2860
    },
    {
      "id": "v15",
      "x": 5590,
      "y": 2860
    },
    {
      "id": "v16",
      "x": 7090,
      "y": 2860
    },
    {
      "id": "v17",
      "x": 8400,
      "y": 2860
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4270
    },
    {
      "id": "v19",
      "x": 1260,
      "y": 4270
    },
    {
      "id": "v20",
      "x": 2670,
      "y": 4270
    },
    {
      "id": "v21",
      "x": 5590,
      "y": 4270
    },
    {
      "id": "v22",
      "x": 7090,
      "y": 4270
    },
    {
      "id": "v23",
      "x": 8400,
      "y": 4270
    },
    {
      "id": "v24",
      "x": 0,
      "y": 5760
    },
    {
      "id": "v25",
      "x": 2670,
      "y": 5760
    },
    {
      "id": "v26",
      "x": 4230,
      "y": 5760
    },
    {
      "id": "v27",
      "x": 5590,
      "y": 5760
    },
    {
      "id": "v28",
      "x": 7090,
      "y": 5760
    },
    {
      "id": "v29",
      "x": 8400,
      "y": 5760
    },
    {
      "id": "v30",
      "x": 0,
      "y": 7040
    },
    {
      "id": "v31",
      "x": 1260,
      "y": 7040
    },
    {
      "id": "v32",
      "x": 2670,
      "y": 7040
    },
    {
      "id": "v33",
      "x": 4230,
      "y": 7040
    },
    {
      "id": "v34",
      "x": 5590,
      "y": 7040
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v15",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v25",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v23",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v28",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v22",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v30",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v27",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w12",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1380,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1380,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1310,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1360,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w7",
        "w6",
        "w5"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w30",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w32",
        "w21",
        "w20",
        "w19",
        "w33",
        "w34",
        "w35",
        "w36"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w30",
        "w29",
        "w31",
        "w16",
        "w15",
        "w14"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w18",
        "w17",
        "w37",
        "w38",
        "w39",
        "w33"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_HEJINGTIANHUI_70: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-hejingtianhui-2br-70",
    "name": "北京合景天汇四期 2室2厅1卫1厨 70m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京合景天汇四期公开真实户型资料按正交几何简化重建；70.00m²为来源标注建筑面积，不等同于房间几何面积。模型约54.60m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1310,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2770,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4380,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5790,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7350,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8700,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1330
    },
    {
      "id": "v9",
      "x": 1310,
      "y": 1330
    },
    {
      "id": "v10",
      "x": 2770,
      "y": 1330
    },
    {
      "id": "v11",
      "x": 5790,
      "y": 1330
    },
    {
      "id": "v12",
      "x": 8700,
      "y": 1330
    },
    {
      "id": "v13",
      "x": 0,
      "y": 2740
    },
    {
      "id": "v14",
      "x": 1310,
      "y": 2740
    },
    {
      "id": "v15",
      "x": 2770,
      "y": 2740
    },
    {
      "id": "v16",
      "x": 5790,
      "y": 2740
    },
    {
      "id": "v17",
      "x": 7350,
      "y": 2740
    },
    {
      "id": "v18",
      "x": 8700,
      "y": 2740
    },
    {
      "id": "v19",
      "x": 0,
      "y": 4250
    },
    {
      "id": "v20",
      "x": 1310,
      "y": 4250
    },
    {
      "id": "v21",
      "x": 2770,
      "y": 4250
    },
    {
      "id": "v22",
      "x": 5790,
      "y": 4250
    },
    {
      "id": "v23",
      "x": 7350,
      "y": 4250
    },
    {
      "id": "v24",
      "x": 8700,
      "y": 4250
    },
    {
      "id": "v25",
      "x": 0,
      "y": 5840
    },
    {
      "id": "v26",
      "x": 2770,
      "y": 5840
    },
    {
      "id": "v27",
      "x": 4380,
      "y": 5840
    },
    {
      "id": "v28",
      "x": 5790,
      "y": 5840
    },
    {
      "id": "v29",
      "x": 7350,
      "y": 5840
    },
    {
      "id": "v30",
      "x": 8700,
      "y": 5840
    },
    {
      "id": "v31",
      "x": 0,
      "y": 7210
    },
    {
      "id": "v32",
      "x": 1310,
      "y": 7210
    },
    {
      "id": "v33",
      "x": 2770,
      "y": 7210
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v26",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v26",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 1410,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1430,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1380,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w31",
        "w21",
        "w20",
        "w19",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w26",
        "w27",
        "w28",
        "w29",
        "w12",
        "w11",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w25",
        "w24",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w15",
        "w14",
        "w36",
        "w37",
        "w38",
        "w16"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_DANGDAIWANGUOFU_70: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-dangdaiwanguofu-2br-70",
    "name": "上海当代万国府MOMA 2室2厅1卫1厨 70m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海当代万国府MOMA公开真实户型资料按正交几何简化重建；70.00m²为来源标注建筑面积，不等同于房间几何面积。模型约60.82m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1340,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2840,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4490,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5940,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7540,
      "y": 0
    },
    {
      "id": "v7",
      "x": 0,
      "y": 1590
    },
    {
      "id": "v8",
      "x": 4490,
      "y": 1590
    },
    {
      "id": "v9",
      "x": 7540,
      "y": 1590
    },
    {
      "id": "v10",
      "x": 8930,
      "y": 1590
    },
    {
      "id": "v11",
      "x": 0,
      "y": 2950
    },
    {
      "id": "v12",
      "x": 1340,
      "y": 2950
    },
    {
      "id": "v13",
      "x": 2840,
      "y": 2950
    },
    {
      "id": "v14",
      "x": 4490,
      "y": 2950
    },
    {
      "id": "v15",
      "x": 7540,
      "y": 2950
    },
    {
      "id": "v16",
      "x": 8930,
      "y": 2950
    },
    {
      "id": "v17",
      "x": 0,
      "y": 4400
    },
    {
      "id": "v18",
      "x": 1340,
      "y": 4400
    },
    {
      "id": "v19",
      "x": 2840,
      "y": 4400
    },
    {
      "id": "v20",
      "x": 5940,
      "y": 4400
    },
    {
      "id": "v21",
      "x": 7540,
      "y": 4400
    },
    {
      "id": "v22",
      "x": 8930,
      "y": 4400
    },
    {
      "id": "v23",
      "x": 0,
      "y": 5940
    },
    {
      "id": "v24",
      "x": 1340,
      "y": 5940
    },
    {
      "id": "v25",
      "x": 2840,
      "y": 5940
    },
    {
      "id": "v26",
      "x": 5940,
      "y": 5940
    },
    {
      "id": "v27",
      "x": 8930,
      "y": 5940
    },
    {
      "id": "v28",
      "x": 2840,
      "y": 7580
    },
    {
      "id": "v29",
      "x": 4490,
      "y": 7580
    },
    {
      "id": "v30",
      "x": 5940,
      "y": 7580
    },
    {
      "id": "v31",
      "x": 7540,
      "y": 7580
    },
    {
      "id": "v32",
      "x": 8930,
      "y": 7580
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v7",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v15",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v20",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v26",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v28",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v25",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v19",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v10",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v16",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v17",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v25",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v23",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v22",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v27",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 1270,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 1470,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w29",
        "w28",
        "w22",
        "w31",
        "w32",
        "w33"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w16",
        "w26",
        "w34",
        "w35",
        "w36",
        "w37",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w15",
        "w14",
        "w27"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_SHENYEJIANGYUEWAN_80: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-shenyejiangyuewan-2br-80",
    "name": "广州深业江悦湾 2室2厅1卫1厨 80m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州深业江悦湾公开真实户型资料按正交几何简化重建；80.00m²为来源标注建筑面积，不等同于房间几何面积。模型约64.64m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1370,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4590,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6070,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7710,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9130,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1530
    },
    {
      "id": "v9",
      "x": 4590,
      "y": 1530
    },
    {
      "id": "v10",
      "x": 7710,
      "y": 1530
    },
    {
      "id": "v11",
      "x": 9130,
      "y": 1530
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3150
    },
    {
      "id": "v13",
      "x": 1370,
      "y": 3150
    },
    {
      "id": "v14",
      "x": 2900,
      "y": 3150
    },
    {
      "id": "v15",
      "x": 4590,
      "y": 3150
    },
    {
      "id": "v16",
      "x": 7710,
      "y": 3150
    },
    {
      "id": "v17",
      "x": 9130,
      "y": 3150
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4550
    },
    {
      "id": "v19",
      "x": 1370,
      "y": 4550
    },
    {
      "id": "v20",
      "x": 2900,
      "y": 4550
    },
    {
      "id": "v21",
      "x": 7710,
      "y": 4550
    },
    {
      "id": "v22",
      "x": 9130,
      "y": 4550
    },
    {
      "id": "v23",
      "x": 0,
      "y": 6030
    },
    {
      "id": "v24",
      "x": 2900,
      "y": 6030
    },
    {
      "id": "v25",
      "x": 4590,
      "y": 6030
    },
    {
      "id": "v26",
      "x": 6070,
      "y": 6030
    },
    {
      "id": "v27",
      "x": 7710,
      "y": 6030
    },
    {
      "id": "v28",
      "x": 9130,
      "y": 6030
    },
    {
      "id": "v29",
      "x": 0,
      "y": 7610
    },
    {
      "id": "v30",
      "x": 1370,
      "y": 7610
    },
    {
      "id": "v31",
      "x": 2900,
      "y": 7610
    },
    {
      "id": "v32",
      "x": 4590,
      "y": 7610
    },
    {
      "id": "v33",
      "x": 6070,
      "y": 7610
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v26",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 1510,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1460,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w16",
        "w15",
        "w14",
        "w13",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w31",
        "w29",
        "w28",
        "w22",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w21",
        "w20",
        "w36",
        "w37",
        "w38",
        "w32"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_LANGUANGSHENGFEI_80: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-languangshengfei-2br-80",
    "name": "成都蓝光圣菲TOWN城 2室2厅1卫1厨 80m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都蓝光圣菲TOWN城公开真实户型资料按正交几何简化重建；80.04m²为来源标注建筑面积，不等同于房间几何面积。模型约66.39m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1480,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3130,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4950,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6550,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1550
    },
    {
      "id": "v7",
      "x": 1480,
      "y": 1550
    },
    {
      "id": "v8",
      "x": 3130,
      "y": 1550
    },
    {
      "id": "v9",
      "x": 6550,
      "y": 1550
    },
    {
      "id": "v10",
      "x": 8310,
      "y": 1550
    },
    {
      "id": "v11",
      "x": 9850,
      "y": 1550
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3200
    },
    {
      "id": "v13",
      "x": 1480,
      "y": 3200
    },
    {
      "id": "v14",
      "x": 3130,
      "y": 3200
    },
    {
      "id": "v15",
      "x": 6550,
      "y": 3200
    },
    {
      "id": "v16",
      "x": 9850,
      "y": 3200
    },
    {
      "id": "v17",
      "x": 0,
      "y": 4950
    },
    {
      "id": "v18",
      "x": 1480,
      "y": 4950
    },
    {
      "id": "v19",
      "x": 3130,
      "y": 4950
    },
    {
      "id": "v20",
      "x": 4950,
      "y": 4950
    },
    {
      "id": "v21",
      "x": 6550,
      "y": 4950
    },
    {
      "id": "v22",
      "x": 8310,
      "y": 4950
    },
    {
      "id": "v23",
      "x": 9850,
      "y": 4950
    },
    {
      "id": "v24",
      "x": 0,
      "y": 6450
    },
    {
      "id": "v25",
      "x": 4950,
      "y": 6450
    },
    {
      "id": "v26",
      "x": 6550,
      "y": 6450
    },
    {
      "id": "v27",
      "x": 8310,
      "y": 6450
    },
    {
      "id": "v28",
      "x": 9850,
      "y": 6450
    },
    {
      "id": "v29",
      "x": 0,
      "y": 8060
    },
    {
      "id": "v30",
      "x": 1480,
      "y": 8060
    },
    {
      "id": "v31",
      "x": 3130,
      "y": 8060
    },
    {
      "id": "v32",
      "x": 4950,
      "y": 8060
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v7",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v15",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v21",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v25",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v17",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v12",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v12",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v11",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v16",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v24",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v25",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v23",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 1320,
      "height": 2200
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1370,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1640,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w8",
        "w5",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w6",
        "w1",
        "w7"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w30",
        "w19",
        "w18",
        "w17",
        "w16",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w12",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w13"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w2",
        "w6",
        "w8",
        "w22",
        "w21",
        "w23"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w29",
        "w28",
        "w36",
        "w37",
        "w38",
        "w14"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_HZ_CHUNBONANYUAN_81: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-hz-chunbonanyuan-2br-81",
    "name": "杭州春波南苑 2室2厅1卫1厨 81m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于杭州春波南苑公开真实户型资料按正交几何简化重建；80.78m²为来源标注建筑面积，不等同于房间几何面积。模型约77.34m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1490,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3150,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4980,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6590,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8370,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9910,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1810
    },
    {
      "id": "v9",
      "x": 3150,
      "y": 1810
    },
    {
      "id": "v10",
      "x": 8370,
      "y": 1810
    },
    {
      "id": "v11",
      "x": 9910,
      "y": 1810
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3370
    },
    {
      "id": "v13",
      "x": 1490,
      "y": 3370
    },
    {
      "id": "v14",
      "x": 3150,
      "y": 3370
    },
    {
      "id": "v15",
      "x": 6590,
      "y": 3370
    },
    {
      "id": "v16",
      "x": 8370,
      "y": 3370
    },
    {
      "id": "v17",
      "x": 9910,
      "y": 3370
    },
    {
      "id": "v18",
      "x": 0,
      "y": 5030
    },
    {
      "id": "v19",
      "x": 1490,
      "y": 5030
    },
    {
      "id": "v20",
      "x": 3150,
      "y": 5030
    },
    {
      "id": "v21",
      "x": 6590,
      "y": 5030
    },
    {
      "id": "v22",
      "x": 8370,
      "y": 5030
    },
    {
      "id": "v23",
      "x": 9910,
      "y": 5030
    },
    {
      "id": "v24",
      "x": 0,
      "y": 6800
    },
    {
      "id": "v25",
      "x": 3150,
      "y": 6800
    },
    {
      "id": "v26",
      "x": 4980,
      "y": 6800
    },
    {
      "id": "v27",
      "x": 6590,
      "y": 6800
    },
    {
      "id": "v28",
      "x": 8370,
      "y": 6800
    },
    {
      "id": "v29",
      "x": 9910,
      "y": 6800
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8310
    },
    {
      "id": "v31",
      "x": 1490,
      "y": 8310
    },
    {
      "id": "v32",
      "x": 3150,
      "y": 8310
    },
    {
      "id": "v33",
      "x": 4980,
      "y": 8310
    },
    {
      "id": "v34",
      "x": 6590,
      "y": 8310
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v15",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v25",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v23",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v29",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v28",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v22",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v30",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v27",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w12",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1650,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w7",
        "w6",
        "w5"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w30",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w32",
        "w21",
        "w20",
        "w19",
        "w33",
        "w34",
        "w35",
        "w36"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w30",
        "w29",
        "w31",
        "w16",
        "w15",
        "w14"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w18",
        "w17",
        "w37",
        "w38",
        "w39",
        "w33"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_HUAHUIMINGYUAN_80: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-huahuimingyuan-2br-80",
    "name": "广州华荟明苑 2室2厅1卫1厨 80m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州华荟明苑公开真实户型资料按正交几何简化重建；80.08m²为来源标注建筑面积，不等同于房间几何面积。模型约67.83m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1410,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2990,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4740,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6260,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7950,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9420,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1630
    },
    {
      "id": "v9",
      "x": 1410,
      "y": 1630
    },
    {
      "id": "v10",
      "x": 2990,
      "y": 1630
    },
    {
      "id": "v11",
      "x": 6260,
      "y": 1630
    },
    {
      "id": "v12",
      "x": 9420,
      "y": 1630
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3350
    },
    {
      "id": "v14",
      "x": 1410,
      "y": 3350
    },
    {
      "id": "v15",
      "x": 2990,
      "y": 3350
    },
    {
      "id": "v16",
      "x": 6260,
      "y": 3350
    },
    {
      "id": "v17",
      "x": 7950,
      "y": 3350
    },
    {
      "id": "v18",
      "x": 9420,
      "y": 3350
    },
    {
      "id": "v19",
      "x": 0,
      "y": 4830
    },
    {
      "id": "v20",
      "x": 1410,
      "y": 4830
    },
    {
      "id": "v21",
      "x": 2990,
      "y": 4830
    },
    {
      "id": "v22",
      "x": 7950,
      "y": 4830
    },
    {
      "id": "v23",
      "x": 9420,
      "y": 4830
    },
    {
      "id": "v24",
      "x": 0,
      "y": 6410
    },
    {
      "id": "v25",
      "x": 2990,
      "y": 6410
    },
    {
      "id": "v26",
      "x": 4740,
      "y": 6410
    },
    {
      "id": "v27",
      "x": 6260,
      "y": 6410
    },
    {
      "id": "v28",
      "x": 7950,
      "y": 6410
    },
    {
      "id": "v29",
      "x": 9420,
      "y": 6410
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8080
    },
    {
      "id": "v31",
      "x": 1410,
      "y": 8080
    },
    {
      "id": "v32",
      "x": 2990,
      "y": 8080
    },
    {
      "id": "v33",
      "x": 7950,
      "y": 8080
    },
    {
      "id": "v34",
      "x": 9420,
      "y": 8080
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v10",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v18",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v25",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v21",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v30",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v23",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v29",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v33",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 1400,
      "height": 2200
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 1450,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1570,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w28",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w3",
        "w9",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w32",
        "w30",
        "w29",
        "w23",
        "w33",
        "w34",
        "w35",
        "w36"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w13",
        "w25",
        "w26",
        "w27",
        "w28",
        "w16",
        "w15",
        "w14"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w24",
        "w29",
        "w30",
        "w31"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w37",
        "w38",
        "w39",
        "w40",
        "w19",
        "w18"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w9",
        "w2",
        "w1",
        "w10"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_NJ_LANYUAN_70: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-nj-lanyuan-3br-70",
    "name": "南京兰园住宅 3室1厅1卫1厨 70m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于南京兰园住宅公开真实户型资料按正交几何简化重建；70.12m²为来源标注建筑面积，不等同于房间几何面积。模型约60.65m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1310,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2780,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4410,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5820,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7390,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8760,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1420
    },
    {
      "id": "v9",
      "x": 1310,
      "y": 1420
    },
    {
      "id": "v10",
      "x": 2780,
      "y": 1420
    },
    {
      "id": "v11",
      "x": 5820,
      "y": 1420
    },
    {
      "id": "v12",
      "x": 8760,
      "y": 1420
    },
    {
      "id": "v13",
      "x": 0,
      "y": 2940
    },
    {
      "id": "v14",
      "x": 1310,
      "y": 2940
    },
    {
      "id": "v15",
      "x": 2780,
      "y": 2940
    },
    {
      "id": "v16",
      "x": 5820,
      "y": 2940
    },
    {
      "id": "v17",
      "x": 7390,
      "y": 2940
    },
    {
      "id": "v18",
      "x": 8760,
      "y": 2940
    },
    {
      "id": "v19",
      "x": 0,
      "y": 4540
    },
    {
      "id": "v20",
      "x": 2780,
      "y": 4540
    },
    {
      "id": "v21",
      "x": 4410,
      "y": 4540
    },
    {
      "id": "v22",
      "x": 5820,
      "y": 4540
    },
    {
      "id": "v23",
      "x": 7390,
      "y": 4540
    },
    {
      "id": "v24",
      "x": 8760,
      "y": 4540
    },
    {
      "id": "v25",
      "x": 0,
      "y": 5920
    },
    {
      "id": "v26",
      "x": 1310,
      "y": 5920
    },
    {
      "id": "v27",
      "x": 2780,
      "y": 5920
    },
    {
      "id": "v28",
      "x": 5820,
      "y": 5920
    },
    {
      "id": "v29",
      "x": 7390,
      "y": 5920
    },
    {
      "id": "v30",
      "x": 8760,
      "y": 5920
    },
    {
      "id": "v31",
      "x": 2780,
      "y": 7390
    },
    {
      "id": "v32",
      "x": 4410,
      "y": 7390
    },
    {
      "id": "v33",
      "x": 5820,
      "y": 7390
    },
    {
      "id": "v34",
      "x": 7390,
      "y": 7390
    },
    {
      "id": "v35",
      "x": 8760,
      "y": 7390
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v29",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v20",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v20",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v28",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v31",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v30",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 1190,
      "height": 2200
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1240,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1450,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 1390,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w29",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w8",
        "w5",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w6",
        "w1",
        "w7"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w31",
        "w21",
        "w20",
        "w19",
        "w18",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w11",
        "w23",
        "w24",
        "w25",
        "w26",
        "w14",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w30",
        "w28",
        "w27",
        "w22",
        "w31",
        "w32",
        "w33",
        "w34"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w2",
        "w6",
        "w8",
        "w27",
        "w28",
        "w29"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w35",
        "w17",
        "w40",
        "w41",
        "w42",
        "w36"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_ANHUIBEILI_80: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-anhueibeili-3br-80",
    "name": "北京安慧北里小区 3室1厅1卫1厨 80m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京安慧北里小区公开真实户型资料按正交几何简化重建；80.00m²为来源标注建筑面积，不等同于房间几何面积。模型约59.90m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1220,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2570,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4080,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5390,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6840,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8100,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1240
    },
    {
      "id": "v9",
      "x": 2570,
      "y": 1240
    },
    {
      "id": "v10",
      "x": 6840,
      "y": 1240
    },
    {
      "id": "v11",
      "x": 8100,
      "y": 1240
    },
    {
      "id": "v12",
      "x": 0,
      "y": 2550
    },
    {
      "id": "v13",
      "x": 1220,
      "y": 2550
    },
    {
      "id": "v14",
      "x": 2570,
      "y": 2550
    },
    {
      "id": "v15",
      "x": 5390,
      "y": 2550
    },
    {
      "id": "v16",
      "x": 6840,
      "y": 2550
    },
    {
      "id": "v17",
      "x": 8100,
      "y": 2550
    },
    {
      "id": "v18",
      "x": 0,
      "y": 3950
    },
    {
      "id": "v19",
      "x": 2570,
      "y": 3950
    },
    {
      "id": "v20",
      "x": 5390,
      "y": 3950
    },
    {
      "id": "v21",
      "x": 6840,
      "y": 3950
    },
    {
      "id": "v22",
      "x": 8100,
      "y": 3950
    },
    {
      "id": "v23",
      "x": 0,
      "y": 5430
    },
    {
      "id": "v24",
      "x": 1220,
      "y": 5430
    },
    {
      "id": "v25",
      "x": 2570,
      "y": 5430
    },
    {
      "id": "v26",
      "x": 4080,
      "y": 5430
    },
    {
      "id": "v27",
      "x": 5390,
      "y": 5430
    },
    {
      "id": "v28",
      "x": 6840,
      "y": 5430
    },
    {
      "id": "v29",
      "x": 8100,
      "y": 5430
    },
    {
      "id": "v30",
      "x": 0,
      "y": 6710
    },
    {
      "id": "v31",
      "x": 4080,
      "y": 6710
    },
    {
      "id": "v32",
      "x": 5390,
      "y": 6710
    },
    {
      "id": "v33",
      "x": 6840,
      "y": 6710
    },
    {
      "id": "v34",
      "x": 8100,
      "y": 6710
    },
    {
      "id": "v35",
      "x": 0,
      "y": 8070
    },
    {
      "id": "v36",
      "x": 1220,
      "y": 8070
    },
    {
      "id": "v37",
      "x": 2570,
      "y": 8070
    },
    {
      "id": "v38",
      "x": 4080,
      "y": 8070
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v15",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v20",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v22",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v27",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v31",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v25",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v19",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v21",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v30",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v31",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v35",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v29",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 1270,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1330,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 1330,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1170,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1300,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w29",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w27",
        "w28",
        "w29",
        "w17",
        "w30",
        "w13",
        "w12",
        "w31"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w36",
        "w34",
        "w33",
        "w24",
        "w23",
        "w37",
        "w38",
        "w39",
        "w40",
        "w41"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w32",
        "w7",
        "w6",
        "w26",
        "w25",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w30",
        "w16",
        "w15",
        "w14"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w20",
        "w19",
        "w42",
        "w43",
        "w44",
        "w21"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_JINGANDONGLI_81: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-jingandongli-3br-81",
    "name": "北京静安东里 3室1厅1卫1厨 81m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京静安东里公开真实户型资料按正交几何简化重建；80.68m²为来源标注建筑面积，不等同于房间几何面积。模型约69.64m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1320,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2790,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4420,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5840,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7420,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8790,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1560
    },
    {
      "id": "v9",
      "x": 1320,
      "y": 1560
    },
    {
      "id": "v10",
      "x": 2790,
      "y": 1560
    },
    {
      "id": "v11",
      "x": 5840,
      "y": 1560
    },
    {
      "id": "v12",
      "x": 8790,
      "y": 1560
    },
    {
      "id": "v13",
      "x": 0,
      "y": 2900
    },
    {
      "id": "v14",
      "x": 1320,
      "y": 2900
    },
    {
      "id": "v15",
      "x": 2790,
      "y": 2900
    },
    {
      "id": "v16",
      "x": 5840,
      "y": 2900
    },
    {
      "id": "v17",
      "x": 7420,
      "y": 2900
    },
    {
      "id": "v18",
      "x": 8790,
      "y": 2900
    },
    {
      "id": "v19",
      "x": 0,
      "y": 4330
    },
    {
      "id": "v20",
      "x": 1320,
      "y": 4330
    },
    {
      "id": "v21",
      "x": 2790,
      "y": 4330
    },
    {
      "id": "v22",
      "x": 4420,
      "y": 4330
    },
    {
      "id": "v23",
      "x": 5840,
      "y": 4330
    },
    {
      "id": "v24",
      "x": 8790,
      "y": 4330
    },
    {
      "id": "v25",
      "x": 0,
      "y": 5850
    },
    {
      "id": "v26",
      "x": 4420,
      "y": 5850
    },
    {
      "id": "v27",
      "x": 5840,
      "y": 5850
    },
    {
      "id": "v28",
      "x": 7420,
      "y": 5850
    },
    {
      "id": "v29",
      "x": 8790,
      "y": 5850
    },
    {
      "id": "v30",
      "x": 0,
      "y": 7460
    },
    {
      "id": "v31",
      "x": 1320,
      "y": 7460
    },
    {
      "id": "v32",
      "x": 2790,
      "y": 7460
    },
    {
      "id": "v33",
      "x": 4420,
      "y": 7460
    },
    {
      "id": "v34",
      "x": 5840,
      "y": 7460
    },
    {
      "id": "v35",
      "x": 7420,
      "y": 7460
    },
    {
      "id": "v36",
      "x": 8790,
      "y": 7460
    },
    {
      "id": "v37",
      "x": 5840,
      "y": 8840
    },
    {
      "id": "v38",
      "x": 7420,
      "y": 8840
    },
    {
      "id": "v39",
      "x": 8790,
      "y": 8840
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v24",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v22",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v26",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v30",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v38",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v37",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v29",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v36",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w26",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 1190,
      "height": 2200
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1380,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1450,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w8",
        "w5",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w6",
        "w1",
        "w7"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w20",
        "w19",
        "w18",
        "w39",
        "w40",
        "w41",
        "w42",
        "w43",
        "w34",
        "w33"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w11",
        "w27",
        "w28",
        "w29",
        "w30",
        "w14",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w32",
        "w23",
        "w22",
        "w21",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w2",
        "w6",
        "w8",
        "w26",
        "w25",
        "w31"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w44",
        "w45",
        "w46",
        "w40",
        "w39",
        "w17"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_WH_DONGTINGHUAYUAN_93: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-wh-dongtinghuayuan-3br-93",
    "name": "武汉东亭花园 3室1厅1卫1厨 93m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于武汉东亭花园公开真实户型资料按正交几何简化重建；92.90m²为来源标注建筑面积，不等同于房间几何面积。模型约86.06m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1520,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3230,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5110,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6750,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8580,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10160,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1700
    },
    {
      "id": "v9",
      "x": 5110,
      "y": 1700
    },
    {
      "id": "v10",
      "x": 8580,
      "y": 1700
    },
    {
      "id": "v11",
      "x": 10160,
      "y": 1700
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3510
    },
    {
      "id": "v13",
      "x": 1520,
      "y": 3510
    },
    {
      "id": "v14",
      "x": 3230,
      "y": 3510
    },
    {
      "id": "v15",
      "x": 5110,
      "y": 3510
    },
    {
      "id": "v16",
      "x": 8580,
      "y": 3510
    },
    {
      "id": "v17",
      "x": 10160,
      "y": 3510
    },
    {
      "id": "v18",
      "x": 0,
      "y": 5060
    },
    {
      "id": "v19",
      "x": 3230,
      "y": 5060
    },
    {
      "id": "v20",
      "x": 5110,
      "y": 5060
    },
    {
      "id": "v21",
      "x": 6750,
      "y": 5060
    },
    {
      "id": "v22",
      "x": 10160,
      "y": 5060
    },
    {
      "id": "v23",
      "x": 0,
      "y": 6710
    },
    {
      "id": "v24",
      "x": 1520,
      "y": 6710
    },
    {
      "id": "v25",
      "x": 3230,
      "y": 6710
    },
    {
      "id": "v26",
      "x": 5110,
      "y": 6710
    },
    {
      "id": "v27",
      "x": 6750,
      "y": 6710
    },
    {
      "id": "v28",
      "x": 8580,
      "y": 6710
    },
    {
      "id": "v29",
      "x": 10160,
      "y": 6710
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8470
    },
    {
      "id": "v31",
      "x": 1520,
      "y": 8470
    },
    {
      "id": "v32",
      "x": 3230,
      "y": 8470
    },
    {
      "id": "v33",
      "x": 5110,
      "y": 8470
    },
    {
      "id": "v34",
      "x": 6750,
      "y": 8470
    },
    {
      "id": "v35",
      "x": 8580,
      "y": 8470
    },
    {
      "id": "v36",
      "x": 10160,
      "y": 8470
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v32",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v25",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v26",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v27",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v19",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v30",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v29",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w29",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 1580,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1700,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w37",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w40",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w6",
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w7"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w36",
        "w35",
        "w23",
        "w38",
        "w39",
        "w40"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w30",
        "w31",
        "w15",
        "w14",
        "w13",
        "w32"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w33",
        "w9",
        "w8",
        "w29",
        "w34",
        "w35",
        "w36",
        "w37"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w28",
        "w27",
        "w26",
        "w25",
        "w24",
        "w34"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w41",
        "w42",
        "w19",
        "w18"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_BEIHUIGUIXIAN_91: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-beihuiguixian-3br-91",
    "name": "成都北回归线 3室1厅1卫1厨 91m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都北回归线公开真实户型资料按正交几何简化重建；90.86m²为来源标注建筑面积，不等同于房间几何面积。模型约72.98m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1320,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4440,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5870,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7450,
      "y": 0
    },
    {
      "id": "v7",
      "x": 8830,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1390
    },
    {
      "id": "v9",
      "x": 4440,
      "y": 1390
    },
    {
      "id": "v10",
      "x": 7450,
      "y": 1390
    },
    {
      "id": "v11",
      "x": 8830,
      "y": 1390
    },
    {
      "id": "v12",
      "x": 0,
      "y": 2870
    },
    {
      "id": "v13",
      "x": 1320,
      "y": 2870
    },
    {
      "id": "v14",
      "x": 2800,
      "y": 2870
    },
    {
      "id": "v15",
      "x": 4440,
      "y": 2870
    },
    {
      "id": "v16",
      "x": 7450,
      "y": 2870
    },
    {
      "id": "v17",
      "x": 8830,
      "y": 2870
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4440
    },
    {
      "id": "v19",
      "x": 1320,
      "y": 4440
    },
    {
      "id": "v20",
      "x": 2800,
      "y": 4440
    },
    {
      "id": "v21",
      "x": 7450,
      "y": 4440
    },
    {
      "id": "v22",
      "x": 8830,
      "y": 4440
    },
    {
      "id": "v23",
      "x": 0,
      "y": 5790
    },
    {
      "id": "v24",
      "x": 2800,
      "y": 5790
    },
    {
      "id": "v25",
      "x": 4440,
      "y": 5790
    },
    {
      "id": "v26",
      "x": 5870,
      "y": 5790
    },
    {
      "id": "v27",
      "x": 7450,
      "y": 5790
    },
    {
      "id": "v28",
      "x": 8830,
      "y": 5790
    },
    {
      "id": "v29",
      "x": 0,
      "y": 7220
    },
    {
      "id": "v30",
      "x": 1320,
      "y": 7220
    },
    {
      "id": "v31",
      "x": 2800,
      "y": 7220
    },
    {
      "id": "v32",
      "x": 7450,
      "y": 7220
    },
    {
      "id": "v33",
      "x": 8830,
      "y": 7220
    },
    {
      "id": "v34",
      "x": 2800,
      "y": 8750
    },
    {
      "id": "v35",
      "x": 4440,
      "y": 8750
    },
    {
      "id": "v36",
      "x": 5870,
      "y": 8750
    },
    {
      "id": "v37",
      "x": 7450,
      "y": 8750
    },
    {
      "id": "v38",
      "x": 8830,
      "y": 8750
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v34",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v28",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v33",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1200,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w40",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1300,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w16",
        "w15",
        "w14",
        "w13",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w32",
        "w21",
        "w20",
        "w19",
        "w36",
        "w37",
        "w38",
        "w39",
        "w40",
        "w41"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w31",
        "w29",
        "w28",
        "w22",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w42",
        "w43",
        "w44",
        "w37",
        "w36",
        "w18"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_GUIHUZHENGRONGFU_100: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-guihuzhengrongfu-3br-100",
    "name": "成都桂湖正荣府 3室2厅2卫1厨 100m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都桂湖正荣府公开真实户型资料按正交几何简化重建；100.00m²为来源标注建筑面积，不等同于房间几何面积。模型约78.00m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1490,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3160,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6610,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8390,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9940,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1820
    },
    {
      "id": "v9",
      "x": 1490,
      "y": 1820
    },
    {
      "id": "v10",
      "x": 3160,
      "y": 1820
    },
    {
      "id": "v11",
      "x": 6610,
      "y": 1820
    },
    {
      "id": "v12",
      "x": 9940,
      "y": 1820
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3380
    },
    {
      "id": "v14",
      "x": 1490,
      "y": 3380
    },
    {
      "id": "v15",
      "x": 3160,
      "y": 3380
    },
    {
      "id": "v16",
      "x": 6610,
      "y": 3380
    },
    {
      "id": "v17",
      "x": 8390,
      "y": 3380
    },
    {
      "id": "v18",
      "x": 9940,
      "y": 3380
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5050
    },
    {
      "id": "v20",
      "x": 3160,
      "y": 5050
    },
    {
      "id": "v21",
      "x": 5000,
      "y": 5050
    },
    {
      "id": "v22",
      "x": 6610,
      "y": 5050
    },
    {
      "id": "v23",
      "x": 8390,
      "y": 5050
    },
    {
      "id": "v24",
      "x": 9940,
      "y": 5050
    },
    {
      "id": "v25",
      "x": 0,
      "y": 6810
    },
    {
      "id": "v26",
      "x": 1490,
      "y": 6810
    },
    {
      "id": "v27",
      "x": 3160,
      "y": 6810
    },
    {
      "id": "v28",
      "x": 6610,
      "y": 6810
    },
    {
      "id": "v29",
      "x": 8390,
      "y": 6810
    },
    {
      "id": "v30",
      "x": 9940,
      "y": 6810
    },
    {
      "id": "v31",
      "x": 3160,
      "y": 8330
    },
    {
      "id": "v32",
      "x": 5000,
      "y": 8330
    },
    {
      "id": "v33",
      "x": 6610,
      "y": 8330
    },
    {
      "id": "v34",
      "x": 8390,
      "y": 8330
    },
    {
      "id": "v35",
      "x": 9940,
      "y": 8330
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v29",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v20",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v31",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v29",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v30",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w34",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 1370,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1660,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w37",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w28",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w40",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w7",
        "w3",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w30",
        "w20",
        "w19",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w10",
        "w22",
        "w23",
        "w24",
        "w25",
        "w13",
        "w12",
        "w11"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w29",
        "w27",
        "w26",
        "w21",
        "w30",
        "w31",
        "w32",
        "w33"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w7",
        "w26",
        "w27",
        "w28"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w17",
        "w39",
        "w40",
        "w35",
        "w34",
        "w18"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w41",
        "w42",
        "w39",
        "w16"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_HUAHUITIANDI_100: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-huahuitiandi-3br-100",
    "name": "成都华汇天地 3室2厅2卫1厨 100m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都华汇天地公开真实户型资料按正交几何简化重建；100.00m²为来源标注建筑面积，不等同于房间几何面积。模型约80.75m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1370,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2910,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4610,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6090,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7730,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9160,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1580
    },
    {
      "id": "v9",
      "x": 4610,
      "y": 1580
    },
    {
      "id": "v10",
      "x": 7730,
      "y": 1580
    },
    {
      "id": "v11",
      "x": 9160,
      "y": 1580
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3260
    },
    {
      "id": "v13",
      "x": 1370,
      "y": 3260
    },
    {
      "id": "v14",
      "x": 2910,
      "y": 3260
    },
    {
      "id": "v15",
      "x": 4610,
      "y": 3260
    },
    {
      "id": "v16",
      "x": 7730,
      "y": 3260
    },
    {
      "id": "v17",
      "x": 9160,
      "y": 3260
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4700
    },
    {
      "id": "v19",
      "x": 1370,
      "y": 4700
    },
    {
      "id": "v20",
      "x": 2910,
      "y": 4700
    },
    {
      "id": "v21",
      "x": 7730,
      "y": 4700
    },
    {
      "id": "v22",
      "x": 9160,
      "y": 4700
    },
    {
      "id": "v23",
      "x": 0,
      "y": 6240
    },
    {
      "id": "v24",
      "x": 2910,
      "y": 6240
    },
    {
      "id": "v25",
      "x": 4610,
      "y": 6240
    },
    {
      "id": "v26",
      "x": 6090,
      "y": 6240
    },
    {
      "id": "v27",
      "x": 7730,
      "y": 6240
    },
    {
      "id": "v28",
      "x": 9160,
      "y": 6240
    },
    {
      "id": "v29",
      "x": 0,
      "y": 7860
    },
    {
      "id": "v30",
      "x": 1370,
      "y": 7860
    },
    {
      "id": "v31",
      "x": 2910,
      "y": 7860
    },
    {
      "id": "v32",
      "x": 4610,
      "y": 7860
    },
    {
      "id": "v33",
      "x": 7730,
      "y": 7860
    },
    {
      "id": "v34",
      "x": 9160,
      "y": 7860
    },
    {
      "id": "v35",
      "x": 2910,
      "y": 9260
    },
    {
      "id": "v36",
      "x": 4610,
      "y": 9260
    },
    {
      "id": "v37",
      "x": 6090,
      "y": 9260
    },
    {
      "id": "v38",
      "x": 7730,
      "y": 9260
    },
    {
      "id": "v39",
      "x": 9160,
      "y": 9260
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v25",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v35",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v27",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v33",
      "to": "v38",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v34",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w36",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1250,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1460,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w42",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w16",
        "w15",
        "w14",
        "w13",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w36",
        "w20",
        "w19",
        "w40",
        "w41",
        "w42",
        "w43",
        "w37"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w31",
        "w29",
        "w28",
        "w22",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w36",
        "w37",
        "w38",
        "w39",
        "w32",
        "w21"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w44",
        "w45",
        "w46",
        "w41",
        "w40",
        "w18"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_WH_YIDAYUNSHANHU_110: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-wh-yidayunshanhu-3br-110",
    "name": "武汉亿达云山湖 3室2厅2卫1厨 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于武汉亿达云山湖公开真实户型资料按正交几何简化重建；110.00m²为来源标注建筑面积，不等同于房间几何面积。模型约81.49m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1470,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3120,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4940,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6530,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8300,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9830,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1600
    },
    {
      "id": "v9",
      "x": 3120,
      "y": 1600
    },
    {
      "id": "v10",
      "x": 4940,
      "y": 1600
    },
    {
      "id": "v11",
      "x": 8300,
      "y": 1600
    },
    {
      "id": "v12",
      "x": 9830,
      "y": 1600
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3300
    },
    {
      "id": "v14",
      "x": 1470,
      "y": 3300
    },
    {
      "id": "v15",
      "x": 3120,
      "y": 3300
    },
    {
      "id": "v16",
      "x": 8300,
      "y": 3300
    },
    {
      "id": "v17",
      "x": 9830,
      "y": 3300
    },
    {
      "id": "v18",
      "x": 0,
      "y": 5090
    },
    {
      "id": "v19",
      "x": 3120,
      "y": 5090
    },
    {
      "id": "v20",
      "x": 4940,
      "y": 5090
    },
    {
      "id": "v21",
      "x": 6530,
      "y": 5090
    },
    {
      "id": "v22",
      "x": 9830,
      "y": 5090
    },
    {
      "id": "v23",
      "x": 0,
      "y": 6640
    },
    {
      "id": "v24",
      "x": 1470,
      "y": 6640
    },
    {
      "id": "v25",
      "x": 3120,
      "y": 6640
    },
    {
      "id": "v26",
      "x": 4940,
      "y": 6640
    },
    {
      "id": "v27",
      "x": 6530,
      "y": 6640
    },
    {
      "id": "v28",
      "x": 8300,
      "y": 6640
    },
    {
      "id": "v29",
      "x": 9830,
      "y": 6640
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8290
    },
    {
      "id": "v31",
      "x": 1470,
      "y": 8290
    },
    {
      "id": "v32",
      "x": 3120,
      "y": 8290
    },
    {
      "id": "v33",
      "x": 4940,
      "y": 8290
    },
    {
      "id": "v34",
      "x": 6530,
      "y": 8290
    },
    {
      "id": "v35",
      "x": 8300,
      "y": 8290
    },
    {
      "id": "v36",
      "x": 9830,
      "y": 8290
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v6",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v22",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v32",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v25",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v26",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v27",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v19",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v12",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v18",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v19",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v30",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v29",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 1470,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w39",
      "position": 0.5,
      "width": 1470,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 1640,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w34",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w42",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w30",
        "w5",
        "w10"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w42",
        "w39",
        "w36"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w31",
        "w32",
        "w16",
        "w15",
        "w14",
        "w33"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w34",
        "w7",
        "w6",
        "w30",
        "w35",
        "w36",
        "w37",
        "w38"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w29",
        "w28",
        "w27",
        "w26",
        "w25",
        "w35"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w4",
        "w11"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w43",
        "w44",
        "w20",
        "w19"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w39",
        "w40",
        "w41",
        "w37"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_WH_BAOLIHUAYUAN_116: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-wh-baolihuayuan-3br-116",
    "name": "武汉保利花园 3室2厅2卫1厨 116m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于武汉保利花园公开真实户型资料按正交几何简化重建；116.15m²为来源标注建筑面积，不等同于房间几何面积。模型约110.23m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1720,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3650,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5780,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7640,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9700,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11490,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1750
    },
    {
      "id": "v9",
      "x": 1720,
      "y": 1750
    },
    {
      "id": "v10",
      "x": 3650,
      "y": 1750
    },
    {
      "id": "v11",
      "x": 7640,
      "y": 1750
    },
    {
      "id": "v12",
      "x": 11490,
      "y": 1750
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3620
    },
    {
      "id": "v14",
      "x": 1720,
      "y": 3620
    },
    {
      "id": "v15",
      "x": 3650,
      "y": 3620
    },
    {
      "id": "v16",
      "x": 7640,
      "y": 3620
    },
    {
      "id": "v17",
      "x": 9700,
      "y": 3620
    },
    {
      "id": "v18",
      "x": 11490,
      "y": 3620
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5610
    },
    {
      "id": "v20",
      "x": 1720,
      "y": 5610
    },
    {
      "id": "v21",
      "x": 3650,
      "y": 5610
    },
    {
      "id": "v22",
      "x": 5780,
      "y": 5610
    },
    {
      "id": "v23",
      "x": 7640,
      "y": 5610
    },
    {
      "id": "v24",
      "x": 9700,
      "y": 5610
    },
    {
      "id": "v25",
      "x": 11490,
      "y": 5610
    },
    {
      "id": "v26",
      "x": 0,
      "y": 7710
    },
    {
      "id": "v27",
      "x": 3650,
      "y": 7710
    },
    {
      "id": "v28",
      "x": 5780,
      "y": 7710
    },
    {
      "id": "v29",
      "x": 9700,
      "y": 7710
    },
    {
      "id": "v30",
      "x": 11490,
      "y": 7710
    },
    {
      "id": "v31",
      "x": 0,
      "y": 9520
    },
    {
      "id": "v32",
      "x": 1720,
      "y": 9520
    },
    {
      "id": "v33",
      "x": 3650,
      "y": 9520
    },
    {
      "id": "v34",
      "x": 5780,
      "y": 9520
    },
    {
      "id": "v35",
      "x": 7640,
      "y": 9520
    },
    {
      "id": "v36",
      "x": 9700,
      "y": 9520
    },
    {
      "id": "v37",
      "x": 3650,
      "y": 11440
    },
    {
      "id": "v38",
      "x": 5780,
      "y": 11440
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v18",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v25",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v29",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v26",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v31",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v29",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v34",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v37",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w43",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1570,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w28",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w45",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w8",
        "w5",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w6",
        "w1",
        "w7"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w34",
        "w16",
        "w15",
        "w32",
        "w40",
        "w41",
        "w42",
        "w43"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w11",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w33",
        "w19",
        "w18",
        "w17",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w2",
        "w6",
        "w8",
        "w22",
        "w21",
        "w28"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w43",
        "w44",
        "w45",
        "w46",
        "w36",
        "w35"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w29",
        "w30",
        "w31",
        "w32",
        "w14",
        "w27"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_HZ_QINGLONGYUAN_110: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-hz-qinglongyuan-3br-110",
    "name": "杭州庆隆苑 3室2厅2卫1厨 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于杭州庆隆苑公开真实户型资料按正交几何简化重建；110.00m²为来源标注建筑面积，不等同于房间几何面积。模型约88.61m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1470,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3110,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4920,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6500,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8250,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9780,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1740
    },
    {
      "id": "v9",
      "x": 4920,
      "y": 1740
    },
    {
      "id": "v10",
      "x": 8250,
      "y": 1740
    },
    {
      "id": "v11",
      "x": 9780,
      "y": 1740
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3230
    },
    {
      "id": "v13",
      "x": 1470,
      "y": 3230
    },
    {
      "id": "v14",
      "x": 3110,
      "y": 3230
    },
    {
      "id": "v15",
      "x": 4920,
      "y": 3230
    },
    {
      "id": "v16",
      "x": 8250,
      "y": 3230
    },
    {
      "id": "v17",
      "x": 9780,
      "y": 3230
    },
    {
      "id": "v18",
      "x": 0,
      "y": 4820
    },
    {
      "id": "v19",
      "x": 1470,
      "y": 4820
    },
    {
      "id": "v20",
      "x": 3110,
      "y": 4820
    },
    {
      "id": "v21",
      "x": 8250,
      "y": 4820
    },
    {
      "id": "v22",
      "x": 9780,
      "y": 4820
    },
    {
      "id": "v23",
      "x": 0,
      "y": 6510
    },
    {
      "id": "v24",
      "x": 3110,
      "y": 6510
    },
    {
      "id": "v25",
      "x": 4920,
      "y": 6510
    },
    {
      "id": "v26",
      "x": 6500,
      "y": 6510
    },
    {
      "id": "v27",
      "x": 8250,
      "y": 6510
    },
    {
      "id": "v28",
      "x": 9780,
      "y": 6510
    },
    {
      "id": "v29",
      "x": 0,
      "y": 8290
    },
    {
      "id": "v30",
      "x": 1470,
      "y": 8290
    },
    {
      "id": "v31",
      "x": 3110,
      "y": 8290
    },
    {
      "id": "v32",
      "x": 4920,
      "y": 8290
    },
    {
      "id": "v33",
      "x": 8250,
      "y": 8290
    },
    {
      "id": "v34",
      "x": 9780,
      "y": 8290
    },
    {
      "id": "v35",
      "x": 4920,
      "y": 9840
    },
    {
      "id": "v36",
      "x": 6500,
      "y": 9840
    },
    {
      "id": "v37",
      "x": 8250,
      "y": 9840
    },
    {
      "id": "v38",
      "x": 9780,
      "y": 9840
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v4",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v23",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v25",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v27",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v33",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v35",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v28",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v34",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w32",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1350,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1570,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w35",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w40",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w30",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w24",
        "w25",
        "w26",
        "w16",
        "w15",
        "w14",
        "w13",
        "w27"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w31",
        "w29",
        "w28",
        "w22",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w36",
        "w20",
        "w19",
        "w38",
        "w39",
        "w40",
        "w41",
        "w42"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w9",
        "w8",
        "w23",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w36",
        "w37",
        "w32",
        "w21"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w43",
        "w44",
        "w45",
        "w39",
        "w38",
        "w18"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_HZ_JUESHIFENGQING_110: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-hz-jueshifengqing-3br-110",
    "name": "杭州爵士风情 3室2厅2卫1厨 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于杭州爵士风情公开真实户型资料按正交几何简化重建；110.20m²为来源标注建筑面积，不等同于房间几何面积。模型约99.19m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1730,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3660,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5790,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7660,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9730,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11520,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1930
    },
    {
      "id": "v9",
      "x": 1730,
      "y": 1930
    },
    {
      "id": "v10",
      "x": 3660,
      "y": 1930
    },
    {
      "id": "v11",
      "x": 7660,
      "y": 1930
    },
    {
      "id": "v12",
      "x": 9730,
      "y": 1930
    },
    {
      "id": "v13",
      "x": 11520,
      "y": 1930
    },
    {
      "id": "v14",
      "x": 0,
      "y": 3980
    },
    {
      "id": "v15",
      "x": 1730,
      "y": 3980
    },
    {
      "id": "v16",
      "x": 3660,
      "y": 3980
    },
    {
      "id": "v17",
      "x": 7660,
      "y": 3980
    },
    {
      "id": "v18",
      "x": 9730,
      "y": 3980
    },
    {
      "id": "v19",
      "x": 11520,
      "y": 3980
    },
    {
      "id": "v20",
      "x": 0,
      "y": 5740
    },
    {
      "id": "v21",
      "x": 3660,
      "y": 5740
    },
    {
      "id": "v22",
      "x": 5790,
      "y": 5740
    },
    {
      "id": "v23",
      "x": 7660,
      "y": 5740
    },
    {
      "id": "v24",
      "x": 9730,
      "y": 5740
    },
    {
      "id": "v25",
      "x": 11520,
      "y": 5740
    },
    {
      "id": "v26",
      "x": 0,
      "y": 7610
    },
    {
      "id": "v27",
      "x": 1730,
      "y": 7610
    },
    {
      "id": "v28",
      "x": 3660,
      "y": 7610
    },
    {
      "id": "v29",
      "x": 7660,
      "y": 7610
    },
    {
      "id": "v30",
      "x": 9730,
      "y": 7610
    },
    {
      "id": "v31",
      "x": 11520,
      "y": 7610
    },
    {
      "id": "v32",
      "x": 3660,
      "y": 9600
    },
    {
      "id": "v33",
      "x": 5790,
      "y": 9600
    },
    {
      "id": "v34",
      "x": 7660,
      "y": 9600
    },
    {
      "id": "v35",
      "x": 9730,
      "y": 9600
    },
    {
      "id": "v36",
      "x": 11520,
      "y": 9600
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v16",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v18",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v24",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v29",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v21",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v7",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v13",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v18",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v14",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v20",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v21",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v26",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v29",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v32",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v25",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v31",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v35",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w15",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w34",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w39",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w8",
        "w5",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w6",
        "w1",
        "w7"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w23",
        "w24",
        "w25",
        "w26",
        "w14",
        "w27",
        "w28",
        "w11"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w32",
        "w30",
        "w29",
        "w22",
        "w33",
        "w34",
        "w35",
        "w36"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w33",
        "w21",
        "w20",
        "w19",
        "w37",
        "w38",
        "w39",
        "w40"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w2",
        "w6",
        "w8",
        "w29",
        "w30",
        "w31"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w27",
        "w13",
        "w12",
        "w28"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w41",
        "w42",
        "w43",
        "w44",
        "w17",
        "w16"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_NJ_CHANGJIANGYUEFU_110: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-nj-changjiangyuefu-3br-110",
    "name": "南京长江悦府 3室2厅2卫1厨 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于南京长江悦府公开真实户型资料按正交几何简化重建；110.00m²为来源标注建筑面积，不等同于房间几何面积。模型约85.82m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1530,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3240,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5120,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6770,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8600,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10190,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1610
    },
    {
      "id": "v9",
      "x": 3240,
      "y": 1610
    },
    {
      "id": "v10",
      "x": 6770,
      "y": 1610
    },
    {
      "id": "v11",
      "x": 10190,
      "y": 1610
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3310
    },
    {
      "id": "v13",
      "x": 1530,
      "y": 3310
    },
    {
      "id": "v14",
      "x": 3240,
      "y": 3310
    },
    {
      "id": "v15",
      "x": 6770,
      "y": 3310
    },
    {
      "id": "v16",
      "x": 8600,
      "y": 3310
    },
    {
      "id": "v17",
      "x": 10190,
      "y": 3310
    },
    {
      "id": "v18",
      "x": 0,
      "y": 5120
    },
    {
      "id": "v19",
      "x": 1530,
      "y": 5120
    },
    {
      "id": "v20",
      "x": 3240,
      "y": 5120
    },
    {
      "id": "v21",
      "x": 5120,
      "y": 5120
    },
    {
      "id": "v22",
      "x": 6770,
      "y": 5120
    },
    {
      "id": "v23",
      "x": 8600,
      "y": 5120
    },
    {
      "id": "v24",
      "x": 10190,
      "y": 5120
    },
    {
      "id": "v25",
      "x": 0,
      "y": 6680
    },
    {
      "id": "v26",
      "x": 1530,
      "y": 6680
    },
    {
      "id": "v27",
      "x": 3240,
      "y": 6680
    },
    {
      "id": "v28",
      "x": 5120,
      "y": 6680
    },
    {
      "id": "v29",
      "x": 6770,
      "y": 6680
    },
    {
      "id": "v30",
      "x": 10190,
      "y": 6680
    },
    {
      "id": "v31",
      "x": 3240,
      "y": 8340
    },
    {
      "id": "v32",
      "x": 5120,
      "y": 8340
    },
    {
      "id": "v33",
      "x": 6770,
      "y": 8340
    },
    {
      "id": "v34",
      "x": 8600,
      "y": 8340
    },
    {
      "id": "v35",
      "x": 10190,
      "y": 8340
    },
    {
      "id": "v36",
      "x": 3240,
      "y": 10100
    },
    {
      "id": "v37",
      "x": 5120,
      "y": 10100
    },
    {
      "id": "v38",
      "x": 6770,
      "y": 10100
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v10",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v15",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v17",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v21",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v28",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v31",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v27",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v25",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v22",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v29",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v30",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v33",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w45",
      "from": "v36",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w36",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1700,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w30",
        "w29",
        "w23",
        "w32",
        "w33",
        "w34"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w35",
        "w17",
        "w16",
        "w38",
        "w39",
        "w40",
        "w41",
        "w36"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w11",
        "w25",
        "w26",
        "w27",
        "w28",
        "w14",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w7",
        "w6",
        "w24",
        "w29",
        "w30",
        "w31"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w35",
        "w36",
        "w37",
        "w20",
        "w19",
        "w18"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w21",
        "w37",
        "w42",
        "w43",
        "w44",
        "w45"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_NJ_ZIYUEFU_110: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-nj-ziyuefu-3br-110",
    "name": "南京紫樾府 3室2厅2卫1厨 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于南京紫樾府公开真实户型资料按正交几何简化重建；110.00m²为来源标注建筑面积，不等同于房间几何面积。模型约85.81m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1470,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3120,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4940,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6530,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8290,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9820,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1790
    },
    {
      "id": "v9",
      "x": 1470,
      "y": 1790
    },
    {
      "id": "v10",
      "x": 3120,
      "y": 1790
    },
    {
      "id": "v11",
      "x": 6530,
      "y": 1790
    },
    {
      "id": "v12",
      "x": 9820,
      "y": 1790
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3340
    },
    {
      "id": "v14",
      "x": 1470,
      "y": 3340
    },
    {
      "id": "v15",
      "x": 3120,
      "y": 3340
    },
    {
      "id": "v16",
      "x": 6530,
      "y": 3340
    },
    {
      "id": "v17",
      "x": 8290,
      "y": 3340
    },
    {
      "id": "v18",
      "x": 9820,
      "y": 3340
    },
    {
      "id": "v19",
      "x": 0,
      "y": 4990
    },
    {
      "id": "v20",
      "x": 1470,
      "y": 4990
    },
    {
      "id": "v21",
      "x": 3120,
      "y": 4990
    },
    {
      "id": "v22",
      "x": 4940,
      "y": 4990
    },
    {
      "id": "v23",
      "x": 6530,
      "y": 4990
    },
    {
      "id": "v24",
      "x": 8290,
      "y": 4990
    },
    {
      "id": "v25",
      "x": 9820,
      "y": 4990
    },
    {
      "id": "v26",
      "x": 0,
      "y": 6730
    },
    {
      "id": "v27",
      "x": 3120,
      "y": 6730
    },
    {
      "id": "v28",
      "x": 4940,
      "y": 6730
    },
    {
      "id": "v29",
      "x": 9820,
      "y": 6730
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8230
    },
    {
      "id": "v31",
      "x": 1470,
      "y": 8230
    },
    {
      "id": "v32",
      "x": 3120,
      "y": 8230
    },
    {
      "id": "v33",
      "x": 4940,
      "y": 8230
    },
    {
      "id": "v34",
      "x": 6530,
      "y": 8230
    },
    {
      "id": "v35",
      "x": 8290,
      "y": 8230
    },
    {
      "id": "v36",
      "x": 9820,
      "y": 8230
    },
    {
      "id": "v37",
      "x": 0,
      "y": 9830
    },
    {
      "id": "v38",
      "x": 1470,
      "y": 9830
    },
    {
      "id": "v39",
      "x": 3120,
      "y": 9830
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v18",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v14",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v26",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v21",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v27",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v30",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v22",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v28",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v29",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v32",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w45",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v37",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w30",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w32",
      "position": 0.5,
      "width": 1470,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1640,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w29",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w28",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w7",
        "w3",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w29",
        "w20",
        "w19",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w10",
        "w24",
        "w25",
        "w26",
        "w27",
        "w13",
        "w12",
        "w11"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w35",
        "w17",
        "w16",
        "w15",
        "w38",
        "w39",
        "w40",
        "w41",
        "w42",
        "w36"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w7",
        "w23",
        "w22",
        "w28"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w35",
        "w36",
        "w37",
        "w31",
        "w30",
        "w18"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w33",
        "w32",
        "w43",
        "w44",
        "w45",
        "w46"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_ZHUJIANGJINMAOFU_109: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-zhujiangjinmaofu-3br-109",
    "name": "广州珠江金茂府 3室2厅2卫1厨 109m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州珠江金茂府公开真实户型资料按正交几何简化重建；109.00m²为来源标注建筑面积，不等同于房间几何面积。模型约97.94m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3390,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5370,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7100,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9020,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10680,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1840
    },
    {
      "id": "v9",
      "x": 3390,
      "y": 1840
    },
    {
      "id": "v10",
      "x": 7100,
      "y": 1840
    },
    {
      "id": "v11",
      "x": 9020,
      "y": 1840
    },
    {
      "id": "v12",
      "x": 10680,
      "y": 1840
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3800
    },
    {
      "id": "v14",
      "x": 1600,
      "y": 3800
    },
    {
      "id": "v15",
      "x": 3390,
      "y": 3800
    },
    {
      "id": "v16",
      "x": 7100,
      "y": 3800
    },
    {
      "id": "v17",
      "x": 9020,
      "y": 3800
    },
    {
      "id": "v18",
      "x": 10680,
      "y": 3800
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5480
    },
    {
      "id": "v20",
      "x": 3390,
      "y": 5480
    },
    {
      "id": "v21",
      "x": 5370,
      "y": 5480
    },
    {
      "id": "v22",
      "x": 7100,
      "y": 5480
    },
    {
      "id": "v23",
      "x": 10680,
      "y": 5480
    },
    {
      "id": "v24",
      "x": 0,
      "y": 7270
    },
    {
      "id": "v25",
      "x": 1600,
      "y": 7270
    },
    {
      "id": "v26",
      "x": 3390,
      "y": 7270
    },
    {
      "id": "v27",
      "x": 5370,
      "y": 7270
    },
    {
      "id": "v28",
      "x": 7100,
      "y": 7270
    },
    {
      "id": "v29",
      "x": 9020,
      "y": 7270
    },
    {
      "id": "v30",
      "x": 10680,
      "y": 7270
    },
    {
      "id": "v31",
      "x": 0,
      "y": 9170
    },
    {
      "id": "v32",
      "x": 1600,
      "y": 9170
    },
    {
      "id": "v33",
      "x": 3390,
      "y": 9170
    },
    {
      "id": "v34",
      "x": 5370,
      "y": 9170
    },
    {
      "id": "v35",
      "x": 7100,
      "y": 9170
    },
    {
      "id": "v36",
      "x": 9020,
      "y": 9170
    },
    {
      "id": "v37",
      "x": 10680,
      "y": 9170
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v18",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v23",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v29",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v33",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v26",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v27",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v28",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v17",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v11",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v20",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v24",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v31",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v30",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w15",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w21",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w39",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w42",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w38",
        "w37",
        "w22",
        "w40",
        "w41",
        "w42"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w29",
        "w30",
        "w31",
        "w32",
        "w14",
        "w33",
        "w34",
        "w11"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w35",
        "w7",
        "w6",
        "w28",
        "w36",
        "w37",
        "w38",
        "w39"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w27",
        "w26",
        "w25",
        "w24",
        "w23",
        "w36"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w33",
        "w13",
        "w12",
        "w34"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w43",
        "w44",
        "w18",
        "w17"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_ZIZAICHENGSHI_113: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-zizaichengshi-3br-113",
    "name": "广州自在城市花园 3室2厅2卫1厨 113m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州自在城市花园公开真实户型资料按正交几何简化重建；112.90m²为来源标注建筑面积，不等同于房间几何面积。模型约92.68m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1520,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3220,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5100,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6750,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8570,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10150,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1650
    },
    {
      "id": "v9",
      "x": 3220,
      "y": 1650
    },
    {
      "id": "v10",
      "x": 5100,
      "y": 1650
    },
    {
      "id": "v11",
      "x": 8570,
      "y": 1650
    },
    {
      "id": "v12",
      "x": 10150,
      "y": 1650
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3400
    },
    {
      "id": "v14",
      "x": 1520,
      "y": 3400
    },
    {
      "id": "v15",
      "x": 3220,
      "y": 3400
    },
    {
      "id": "v16",
      "x": 6750,
      "y": 3400
    },
    {
      "id": "v17",
      "x": 8570,
      "y": 3400
    },
    {
      "id": "v18",
      "x": 10150,
      "y": 3400
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5260
    },
    {
      "id": "v20",
      "x": 3220,
      "y": 5260
    },
    {
      "id": "v21",
      "x": 6750,
      "y": 5260
    },
    {
      "id": "v22",
      "x": 8570,
      "y": 5260
    },
    {
      "id": "v23",
      "x": 10150,
      "y": 5260
    },
    {
      "id": "v24",
      "x": 0,
      "y": 6860
    },
    {
      "id": "v25",
      "x": 1520,
      "y": 6860
    },
    {
      "id": "v26",
      "x": 3220,
      "y": 6860
    },
    {
      "id": "v27",
      "x": 6750,
      "y": 6860
    },
    {
      "id": "v28",
      "x": 8570,
      "y": 6860
    },
    {
      "id": "v29",
      "x": 10150,
      "y": 6860
    },
    {
      "id": "v30",
      "x": 0,
      "y": 8560
    },
    {
      "id": "v31",
      "x": 3220,
      "y": 8560
    },
    {
      "id": "v32",
      "x": 5100,
      "y": 8560
    },
    {
      "id": "v33",
      "x": 6750,
      "y": 8560
    },
    {
      "id": "v34",
      "x": 8570,
      "y": 8560
    },
    {
      "id": "v35",
      "x": 10150,
      "y": 8560
    },
    {
      "id": "v36",
      "x": 0,
      "y": 10360
    },
    {
      "id": "v37",
      "x": 1520,
      "y": 10360
    },
    {
      "id": "v38",
      "x": 3220,
      "y": 10360
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v6",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v16",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v21",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v22",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v23",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v27",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v31",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v26",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v20",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v24",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v17",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v18",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v30",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v31",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v36",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v29",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w26",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 1400,
      "height": 2200
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 1470,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1700,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w34",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w44",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w5",
        "w10"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w32",
        "w33",
        "w15",
        "w30"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w34",
        "w7",
        "w6",
        "w28",
        "w27",
        "w35",
        "w36",
        "w37"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w40",
        "w36",
        "w35",
        "w26",
        "w41",
        "w42",
        "w43",
        "w44"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w38",
        "w18",
        "w17",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w4",
        "w11"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w22",
        "w21",
        "w45",
        "w46",
        "w47",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w39",
        "w19",
        "w38",
        "w33"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "阳台三",
      "boundaryWallIds": [
        "w29",
        "w30",
        "w14",
        "w31"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_TIANTONGYUANBEI_155: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-tiantongyuanbei-3br-155",
    "name": "北京天通苑北一区 3室2厅2卫1厨 155m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京天通苑北一区公开真实户型资料按正交几何简化重建；155.03m²为来源标注建筑面积，不等同于房间几何面积。模型约105.03m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1740,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3690,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5850,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7730,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9810,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11620,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1770
    },
    {
      "id": "v9",
      "x": 1740,
      "y": 1770
    },
    {
      "id": "v10",
      "x": 3690,
      "y": 1770
    },
    {
      "id": "v11",
      "x": 7730,
      "y": 1770
    },
    {
      "id": "v12",
      "x": 11620,
      "y": 1770
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3660
    },
    {
      "id": "v14",
      "x": 1740,
      "y": 3660
    },
    {
      "id": "v15",
      "x": 3690,
      "y": 3660
    },
    {
      "id": "v16",
      "x": 7730,
      "y": 3660
    },
    {
      "id": "v17",
      "x": 9810,
      "y": 3660
    },
    {
      "id": "v18",
      "x": 11620,
      "y": 3660
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5670
    },
    {
      "id": "v20",
      "x": 3690,
      "y": 5670
    },
    {
      "id": "v21",
      "x": 5850,
      "y": 5670
    },
    {
      "id": "v22",
      "x": 7730,
      "y": 5670
    },
    {
      "id": "v23",
      "x": 9810,
      "y": 5670
    },
    {
      "id": "v24",
      "x": 11620,
      "y": 5670
    },
    {
      "id": "v25",
      "x": 0,
      "y": 7790
    },
    {
      "id": "v26",
      "x": 1740,
      "y": 7790
    },
    {
      "id": "v27",
      "x": 3690,
      "y": 7790
    },
    {
      "id": "v28",
      "x": 5850,
      "y": 7790
    },
    {
      "id": "v29",
      "x": 7730,
      "y": 7790
    },
    {
      "id": "v30",
      "x": 9810,
      "y": 7790
    },
    {
      "id": "v31",
      "x": 11620,
      "y": 7790
    },
    {
      "id": "v32",
      "x": 3690,
      "y": 9620
    },
    {
      "id": "v33",
      "x": 5850,
      "y": 9620
    },
    {
      "id": "v34",
      "x": 7730,
      "y": 9620
    },
    {
      "id": "v35",
      "x": 9810,
      "y": 9620
    },
    {
      "id": "v36",
      "x": 11620,
      "y": 9620
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v18",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v28",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v20",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v26",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v25",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v28",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v32",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v24",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v30",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v31",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w12",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w34",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w39",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w37",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w33",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w7",
        "w3",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w16",
        "w15",
        "w37",
        "w38",
        "w39",
        "w40",
        "w41",
        "w34",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w29",
        "w27",
        "w26",
        "w21",
        "w30",
        "w31",
        "w32",
        "w33"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w10",
        "w22",
        "w23",
        "w24",
        "w25",
        "w13",
        "w12",
        "w11"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w7",
        "w26",
        "w27",
        "w28"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w19",
        "w34",
        "w35",
        "w36",
        "w30",
        "w20"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w42",
        "w43",
        "w39",
        "w38"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_HUIGUYANGGUANG_154: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-huiguyangguang-3br-154",
    "name": "北京慧谷阳光 3室2厅2卫1厨 154m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京慧谷阳光公开真实户型资料按正交几何简化重建；154.20m²为来源标注建筑面积，不等同于房间几何面积。模型约113.13m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1680,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3560,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5630,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7440,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9450,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11190,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1990
    },
    {
      "id": "v9",
      "x": 3560,
      "y": 1990
    },
    {
      "id": "v10",
      "x": 7440,
      "y": 1990
    },
    {
      "id": "v11",
      "x": 11190,
      "y": 1990
    },
    {
      "id": "v12",
      "x": 0,
      "y": 3700
    },
    {
      "id": "v13",
      "x": 1680,
      "y": 3700
    },
    {
      "id": "v14",
      "x": 3560,
      "y": 3700
    },
    {
      "id": "v15",
      "x": 7440,
      "y": 3700
    },
    {
      "id": "v16",
      "x": 9450,
      "y": 3700
    },
    {
      "id": "v17",
      "x": 11190,
      "y": 3700
    },
    {
      "id": "v18",
      "x": 0,
      "y": 5520
    },
    {
      "id": "v19",
      "x": 1680,
      "y": 5520
    },
    {
      "id": "v20",
      "x": 3560,
      "y": 5520
    },
    {
      "id": "v21",
      "x": 5630,
      "y": 5520
    },
    {
      "id": "v22",
      "x": 7440,
      "y": 5520
    },
    {
      "id": "v23",
      "x": 9450,
      "y": 5520
    },
    {
      "id": "v24",
      "x": 11190,
      "y": 5520
    },
    {
      "id": "v25",
      "x": 0,
      "y": 7450
    },
    {
      "id": "v26",
      "x": 1680,
      "y": 7450
    },
    {
      "id": "v27",
      "x": 3560,
      "y": 7450
    },
    {
      "id": "v28",
      "x": 5630,
      "y": 7450
    },
    {
      "id": "v29",
      "x": 7440,
      "y": 7450
    },
    {
      "id": "v30",
      "x": 11190,
      "y": 7450
    },
    {
      "id": "v31",
      "x": 0,
      "y": 9500
    },
    {
      "id": "v32",
      "x": 1680,
      "y": 9500
    },
    {
      "id": "v33",
      "x": 3560,
      "y": 9500
    },
    {
      "id": "v34",
      "x": 5630,
      "y": 9500
    },
    {
      "id": "v35",
      "x": 7440,
      "y": 9500
    },
    {
      "id": "v36",
      "x": 9450,
      "y": 9500
    },
    {
      "id": "v37",
      "x": 11190,
      "y": 9500
    },
    {
      "id": "v38",
      "x": 3560,
      "y": 11260
    },
    {
      "id": "v39",
      "x": 5630,
      "y": 11260
    },
    {
      "id": "v40",
      "x": 7440,
      "y": 11260
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v10",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v15",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v16",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v28",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v34",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v33",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v27",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v18",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v11",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v17",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v25",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v22",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w36",
      "from": "v29",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v35",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v24",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v30",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v37",
      "to": "v36",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v36",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v26",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v31",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v35",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w47",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w49",
      "from": "v38",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w36",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w42",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w39",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w45",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w34",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w7",
        "w6",
        "w5"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w20",
        "w45",
        "w42",
        "w32"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w35",
        "w15",
        "w31",
        "w38",
        "w39",
        "w40",
        "w41",
        "w36"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w11",
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w13",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w23",
        "w22",
        "w21",
        "w32",
        "w33",
        "w34"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w35",
        "w36",
        "w37",
        "w18",
        "w17",
        "w16"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w19",
        "w37",
        "w46",
        "w47",
        "w48",
        "w49"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w42",
        "w43",
        "w44",
        "w33"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "阳台三",
      "boundaryWallIds": [
        "w30",
        "w31",
        "w14",
        "w29"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_HUIHAOTIANXIA_149: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-huihaotianxia-3br-149",
    "name": "上海汇豪天下 3室2厅2卫1厨 149m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海汇豪天下公开真实户型资料按正交几何简化重建；149.45m²为来源标注建筑面积，不等同于房间几何面积。模型约103.79m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1670,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3550,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5610,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7420,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9420,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11160,
      "y": 0
    },
    {
      "id": "v8",
      "x": 0,
      "y": 1870
    },
    {
      "id": "v9",
      "x": 3550,
      "y": 1870
    },
    {
      "id": "v10",
      "x": 5610,
      "y": 1870
    },
    {
      "id": "v11",
      "x": 7420,
      "y": 1870
    },
    {
      "id": "v12",
      "x": 11160,
      "y": 1870
    },
    {
      "id": "v13",
      "x": 0,
      "y": 3850
    },
    {
      "id": "v14",
      "x": 1670,
      "y": 3850
    },
    {
      "id": "v15",
      "x": 3550,
      "y": 3850
    },
    {
      "id": "v16",
      "x": 7420,
      "y": 3850
    },
    {
      "id": "v17",
      "x": 9420,
      "y": 3850
    },
    {
      "id": "v18",
      "x": 11160,
      "y": 3850
    },
    {
      "id": "v19",
      "x": 0,
      "y": 5560
    },
    {
      "id": "v20",
      "x": 1670,
      "y": 5560
    },
    {
      "id": "v21",
      "x": 3550,
      "y": 5560
    },
    {
      "id": "v22",
      "x": 11160,
      "y": 5560
    },
    {
      "id": "v23",
      "x": 0,
      "y": 7370
    },
    {
      "id": "v24",
      "x": 3550,
      "y": 7370
    },
    {
      "id": "v25",
      "x": 5610,
      "y": 7370
    },
    {
      "id": "v26",
      "x": 7420,
      "y": 7370
    },
    {
      "id": "v27",
      "x": 9420,
      "y": 7370
    },
    {
      "id": "v28",
      "x": 11160,
      "y": 7370
    },
    {
      "id": "v29",
      "x": 0,
      "y": 9300
    },
    {
      "id": "v30",
      "x": 1670,
      "y": 9300
    },
    {
      "id": "v31",
      "x": 3550,
      "y": 9300
    },
    {
      "id": "v32",
      "x": 5610,
      "y": 9300
    },
    {
      "id": "v33",
      "x": 7420,
      "y": 9300
    },
    {
      "id": "v34",
      "x": 9420,
      "y": 9300
    },
    {
      "id": "v35",
      "x": 11160,
      "y": 9300
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v8",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v9",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v14",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v13",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v10",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v16",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v17",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v18",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v24",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v21",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v7",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v12",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v19",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v23",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v24",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v31",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v29",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v25",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v32",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v28",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v35",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w17",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w24",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1630,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w36",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w5",
        "w10",
        "w9"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w37",
        "w38",
        "w33",
        "w22"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w13",
        "w25",
        "w26",
        "w27",
        "w28",
        "w16",
        "w15",
        "w14"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w32",
        "w30",
        "w29",
        "w23",
        "w33",
        "w34",
        "w35",
        "w36"
      ]
    },
    {
      "id": "r6",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w7",
        "w6",
        "w24",
        "w29",
        "w30",
        "w31"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w4",
        "w11"
      ]
    },
    {
      "id": "r8",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w20",
        "w19",
        "w41",
        "w42",
        "w43",
        "w39"
      ]
    },
    {
      "id": "r9",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w39",
        "w40",
        "w37",
        "w21"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_JINGXI_120: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-jingxi-4br-120",
    "name": "北京京玺 4室2厅2卫1厨 120m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京京玺公开真实户型资料按正交几何简化重建；120.00m²为来源标注建筑面积，不等同于房间几何面积。模型约93.62m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1440,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3060,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4840,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6400,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8130,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9630,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11300,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1520
    },
    {
      "id": "v10",
      "x": 1440,
      "y": 1520
    },
    {
      "id": "v11",
      "x": 3060,
      "y": 1520
    },
    {
      "id": "v12",
      "x": 6400,
      "y": 1520
    },
    {
      "id": "v13",
      "x": 8130,
      "y": 1520
    },
    {
      "id": "v14",
      "x": 11300,
      "y": 1520
    },
    {
      "id": "v15",
      "x": 0,
      "y": 3130
    },
    {
      "id": "v16",
      "x": 1440,
      "y": 3130
    },
    {
      "id": "v17",
      "x": 3060,
      "y": 3130
    },
    {
      "id": "v18",
      "x": 4840,
      "y": 3130
    },
    {
      "id": "v19",
      "x": 6400,
      "y": 3130
    },
    {
      "id": "v20",
      "x": 8130,
      "y": 3130
    },
    {
      "id": "v21",
      "x": 9630,
      "y": 3130
    },
    {
      "id": "v22",
      "x": 11300,
      "y": 3130
    },
    {
      "id": "v23",
      "x": 12740,
      "y": 3130
    },
    {
      "id": "v24",
      "x": 0,
      "y": 4840
    },
    {
      "id": "v25",
      "x": 1440,
      "y": 4840
    },
    {
      "id": "v26",
      "x": 3060,
      "y": 4840
    },
    {
      "id": "v27",
      "x": 4840,
      "y": 4840
    },
    {
      "id": "v28",
      "x": 6400,
      "y": 4840
    },
    {
      "id": "v29",
      "x": 8130,
      "y": 4840
    },
    {
      "id": "v30",
      "x": 9630,
      "y": 4840
    },
    {
      "id": "v31",
      "x": 11300,
      "y": 4840
    },
    {
      "id": "v32",
      "x": 12740,
      "y": 4840
    },
    {
      "id": "v33",
      "x": 0,
      "y": 6310
    },
    {
      "id": "v34",
      "x": 1440,
      "y": 6310
    },
    {
      "id": "v35",
      "x": 4840,
      "y": 6310
    },
    {
      "id": "v36",
      "x": 8130,
      "y": 6310
    },
    {
      "id": "v37",
      "x": 11300,
      "y": 6310
    },
    {
      "id": "v38",
      "x": 12740,
      "y": 6310
    },
    {
      "id": "v39",
      "x": 0,
      "y": 7880
    },
    {
      "id": "v40",
      "x": 1440,
      "y": 7880
    },
    {
      "id": "v41",
      "x": 3060,
      "y": 7880
    },
    {
      "id": "v42",
      "x": 4840,
      "y": 7880
    },
    {
      "id": "v43",
      "x": 6400,
      "y": 7880
    },
    {
      "id": "v44",
      "x": 8130,
      "y": 7880
    },
    {
      "id": "v45",
      "x": 9630,
      "y": 7880
    },
    {
      "id": "v46",
      "x": 11300,
      "y": 7880
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v6",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v13",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v24",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v22",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v23",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v37",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v22",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v25",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v34",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v39",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v33",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v27",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w47",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w49",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w50",
      "from": "v29",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w51",
      "from": "v36",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w53",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v37",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w55",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w56",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w27",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w29",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 1530,
      "height": 2200
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w2",
      "position": 0.5,
      "width": 1440,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w27",
      "position": 0.72,
      "width": 500,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w48",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w55",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w44",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w27",
        "w5",
        "w4",
        "w16",
        "w15",
        "w19",
        "w26",
        "w25",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w3"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w41",
        "w34",
        "w33",
        "w46",
        "w47",
        "w48",
        "w49",
        "w42"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w46",
        "w32",
        "w31",
        "w50",
        "w51",
        "w52",
        "w53",
        "w47"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w50",
        "w30",
        "w29",
        "w39",
        "w54",
        "w55",
        "w56",
        "w51"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w41",
        "w42",
        "w43",
        "w44",
        "w45",
        "w35"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w17",
        "w18",
        "w19",
        "w14",
        "w13",
        "w20"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w36",
        "w37",
        "w38",
        "w39",
        "w28",
        "w40"
      ]
    },
    {
      "id": "r11",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w9",
        "w2",
        "w1",
        "w10"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_BJ_SHOUKAIJINMAO_120: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-bj-shoukaijinmao-4br-120",
    "name": "北京首开金茂望京樾 4室2厅2卫1厨 120m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于北京首开金茂望京樾公开真实户型资料按正交几何简化重建；120.00m²为来源标注建筑面积，不等同于房间几何面积。模型约89.03m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1390,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2950,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4660,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6160,
      "y": 0
    },
    {
      "id": "v6",
      "x": 7830,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9270,
      "y": 0
    },
    {
      "id": "v8",
      "x": 10880,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1690
    },
    {
      "id": "v10",
      "x": 2950,
      "y": 1690
    },
    {
      "id": "v11",
      "x": 4660,
      "y": 1690
    },
    {
      "id": "v12",
      "x": 7830,
      "y": 1690
    },
    {
      "id": "v13",
      "x": 10880,
      "y": 1690
    },
    {
      "id": "v14",
      "x": 0,
      "y": 3160
    },
    {
      "id": "v15",
      "x": 1390,
      "y": 3160
    },
    {
      "id": "v16",
      "x": 2950,
      "y": 3160
    },
    {
      "id": "v17",
      "x": 4660,
      "y": 3160
    },
    {
      "id": "v18",
      "x": 6160,
      "y": 3160
    },
    {
      "id": "v19",
      "x": 7830,
      "y": 3160
    },
    {
      "id": "v20",
      "x": 9270,
      "y": 3160
    },
    {
      "id": "v21",
      "x": 10880,
      "y": 3160
    },
    {
      "id": "v22",
      "x": 12280,
      "y": 3160
    },
    {
      "id": "v23",
      "x": 0,
      "y": 4710
    },
    {
      "id": "v24",
      "x": 1390,
      "y": 4710
    },
    {
      "id": "v25",
      "x": 2950,
      "y": 4710
    },
    {
      "id": "v26",
      "x": 4660,
      "y": 4710
    },
    {
      "id": "v27",
      "x": 6160,
      "y": 4710
    },
    {
      "id": "v28",
      "x": 7830,
      "y": 4710
    },
    {
      "id": "v29",
      "x": 9270,
      "y": 4710
    },
    {
      "id": "v30",
      "x": 10880,
      "y": 4710
    },
    {
      "id": "v31",
      "x": 12280,
      "y": 4710
    },
    {
      "id": "v32",
      "x": 0,
      "y": 6360
    },
    {
      "id": "v33",
      "x": 1390,
      "y": 6360
    },
    {
      "id": "v34",
      "x": 4660,
      "y": 6360
    },
    {
      "id": "v35",
      "x": 7830,
      "y": 6360
    },
    {
      "id": "v36",
      "x": 10880,
      "y": 6360
    },
    {
      "id": "v37",
      "x": 12280,
      "y": 6360
    },
    {
      "id": "v38",
      "x": 1390,
      "y": 7770
    },
    {
      "id": "v39",
      "x": 2950,
      "y": 7770
    },
    {
      "id": "v40",
      "x": 4660,
      "y": 7770
    },
    {
      "id": "v41",
      "x": 6160,
      "y": 7770
    },
    {
      "id": "v42",
      "x": 7830,
      "y": 7770
    },
    {
      "id": "v43",
      "x": 9270,
      "y": 7770
    },
    {
      "id": "v44",
      "x": 10880,
      "y": 7770
    },
    {
      "id": "v45",
      "x": 12280,
      "y": 7770
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v8",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v15",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v24",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v32",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v23",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v21",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v22",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v34",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v38",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v30",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v36",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w52",
      "from": "v31",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v37",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w54",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w30",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w32",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 1370,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1370,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w46",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w21",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w25",
        "w6",
        "w11",
        "w18",
        "w17",
        "w24",
        "w23",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w15",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w44",
        "w34",
        "w33",
        "w48",
        "w49",
        "w50",
        "w51",
        "w45"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w39",
        "w36",
        "w35",
        "w44",
        "w45",
        "w46",
        "w47",
        "w40"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w26",
        "w38",
        "w37",
        "w39",
        "w40",
        "w41",
        "w42",
        "w43"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w52",
        "w53",
        "w54",
        "w49",
        "w48",
        "w32"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w7"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_YUJINGHUATING_163: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-yujinghuating-4br-163",
    "name": "上海愉景华庭 4室2厅2卫1厨 163m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海愉景华庭公开真实户型资料按正交几何简化重建；163.27m²为来源标注建筑面积，不等同于房间几何面积。模型约150.56m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1770,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3740,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5930,
      "y": 0
    },
    {
      "id": "v5",
      "x": 7830,
      "y": 0
    },
    {
      "id": "v6",
      "x": 9950,
      "y": 0
    },
    {
      "id": "v7",
      "x": 11780,
      "y": 0
    },
    {
      "id": "v8",
      "x": 13830,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 2030
    },
    {
      "id": "v10",
      "x": 3740,
      "y": 2030
    },
    {
      "id": "v11",
      "x": 5930,
      "y": 2030
    },
    {
      "id": "v12",
      "x": 7830,
      "y": 2030
    },
    {
      "id": "v13",
      "x": 9950,
      "y": 2030
    },
    {
      "id": "v14",
      "x": 13830,
      "y": 2030
    },
    {
      "id": "v15",
      "x": 15600,
      "y": 2030
    },
    {
      "id": "v16",
      "x": 0,
      "y": 4190
    },
    {
      "id": "v17",
      "x": 1770,
      "y": 4190
    },
    {
      "id": "v18",
      "x": 3740,
      "y": 4190
    },
    {
      "id": "v19",
      "x": 5930,
      "y": 4190
    },
    {
      "id": "v20",
      "x": 7830,
      "y": 4190
    },
    {
      "id": "v21",
      "x": 9950,
      "y": 4190
    },
    {
      "id": "v22",
      "x": 11780,
      "y": 4190
    },
    {
      "id": "v23",
      "x": 13830,
      "y": 4190
    },
    {
      "id": "v24",
      "x": 15600,
      "y": 4190
    },
    {
      "id": "v25",
      "x": 0,
      "y": 6050
    },
    {
      "id": "v26",
      "x": 1770,
      "y": 6050
    },
    {
      "id": "v27",
      "x": 3740,
      "y": 6050
    },
    {
      "id": "v28",
      "x": 5930,
      "y": 6050
    },
    {
      "id": "v29",
      "x": 7830,
      "y": 6050
    },
    {
      "id": "v30",
      "x": 9950,
      "y": 6050
    },
    {
      "id": "v31",
      "x": 11780,
      "y": 6050
    },
    {
      "id": "v32",
      "x": 13830,
      "y": 6050
    },
    {
      "id": "v33",
      "x": 15600,
      "y": 6050
    },
    {
      "id": "v34",
      "x": 0,
      "y": 8020
    },
    {
      "id": "v35",
      "x": 3740,
      "y": 8020
    },
    {
      "id": "v36",
      "x": 5930,
      "y": 8020
    },
    {
      "id": "v37",
      "x": 9950,
      "y": 8020
    },
    {
      "id": "v38",
      "x": 13830,
      "y": 8020
    },
    {
      "id": "v39",
      "x": 15600,
      "y": 8020
    },
    {
      "id": "v40",
      "x": 0,
      "y": 10120
    },
    {
      "id": "v41",
      "x": 1770,
      "y": 10120
    },
    {
      "id": "v42",
      "x": 3740,
      "y": 10120
    },
    {
      "id": "v43",
      "x": 5930,
      "y": 10120
    },
    {
      "id": "v44",
      "x": 7830,
      "y": 10120
    },
    {
      "id": "v45",
      "x": 9950,
      "y": 10120
    },
    {
      "id": "v46",
      "x": 11780,
      "y": 10120
    },
    {
      "id": "v47",
      "x": 13830,
      "y": 10120
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v16",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v12",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v6",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v13",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v15",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v24",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v33",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v38",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v32",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v25",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v34",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v27",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v40",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v28",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v36",
      "to": "v43",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v30",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v37",
      "to": "v45",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v38",
      "to": "v47",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w56",
      "from": "v47",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w57",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w34",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w39",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w40",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w32",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w34",
      "position": 0.72,
      "width": 500,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w47",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w53",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w55",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w34",
        "w7",
        "w6",
        "w13",
        "w12",
        "w19",
        "w26",
        "w25",
        "w32",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39",
        "w40",
        "w41"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w5",
        "w4",
        "w14"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w42",
        "w41",
        "w40",
        "w43",
        "w44",
        "w45",
        "w46",
        "w47"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w48",
        "w38",
        "w37",
        "w51",
        "w52",
        "w53",
        "w54",
        "w49"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w51",
        "w36",
        "w35",
        "w31",
        "w55",
        "w56",
        "w57",
        "w52"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w48",
        "w49",
        "w50",
        "w44",
        "w43",
        "w39"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w17",
        "w18",
        "w19",
        "w11",
        "w15",
        "w20"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w27",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w24",
        "w33"
      ]
    },
    {
      "id": "r11",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w15",
        "w10",
        "w9",
        "w16"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_BINJIANGTIANDI_132: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-binjiangtiandi-4br-132",
    "name": "广州广州滨江天地 4室2厅2卫1厨 132m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州广州滨江天地公开真实户型资料按正交几何简化重建；132.00m²为来源标注建筑面积，不等同于房间几何面积。模型约102.95m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1440,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3050,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4830,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6380,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8110,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9600,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11270,
      "y": 0
    },
    {
      "id": "v9",
      "x": 12710,
      "y": 0
    },
    {
      "id": "v10",
      "x": 0,
      "y": 1560
    },
    {
      "id": "v11",
      "x": 1440,
      "y": 1560
    },
    {
      "id": "v12",
      "x": 3050,
      "y": 1560
    },
    {
      "id": "v13",
      "x": 6380,
      "y": 1560
    },
    {
      "id": "v14",
      "x": 8110,
      "y": 1560
    },
    {
      "id": "v15",
      "x": 11270,
      "y": 1560
    },
    {
      "id": "v16",
      "x": 12710,
      "y": 1560
    },
    {
      "id": "v17",
      "x": 0,
      "y": 3220
    },
    {
      "id": "v18",
      "x": 1440,
      "y": 3220
    },
    {
      "id": "v19",
      "x": 3050,
      "y": 3220
    },
    {
      "id": "v20",
      "x": 4830,
      "y": 3220
    },
    {
      "id": "v21",
      "x": 6380,
      "y": 3220
    },
    {
      "id": "v22",
      "x": 8110,
      "y": 3220
    },
    {
      "id": "v23",
      "x": 9600,
      "y": 3220
    },
    {
      "id": "v24",
      "x": 11270,
      "y": 3220
    },
    {
      "id": "v25",
      "x": 12710,
      "y": 3220
    },
    {
      "id": "v26",
      "x": 0,
      "y": 4980
    },
    {
      "id": "v27",
      "x": 1440,
      "y": 4980
    },
    {
      "id": "v28",
      "x": 3050,
      "y": 4980
    },
    {
      "id": "v29",
      "x": 4830,
      "y": 4980
    },
    {
      "id": "v30",
      "x": 6380,
      "y": 4980
    },
    {
      "id": "v31",
      "x": 8110,
      "y": 4980
    },
    {
      "id": "v32",
      "x": 9600,
      "y": 4980
    },
    {
      "id": "v33",
      "x": 11270,
      "y": 4980
    },
    {
      "id": "v34",
      "x": 12710,
      "y": 4980
    },
    {
      "id": "v35",
      "x": 0,
      "y": 6490
    },
    {
      "id": "v36",
      "x": 1440,
      "y": 6490
    },
    {
      "id": "v37",
      "x": 4830,
      "y": 6490
    },
    {
      "id": "v38",
      "x": 8110,
      "y": 6490
    },
    {
      "id": "v39",
      "x": 12710,
      "y": 6490
    },
    {
      "id": "v40",
      "x": 0,
      "y": 8100
    },
    {
      "id": "v41",
      "x": 1440,
      "y": 8100
    },
    {
      "id": "v42",
      "x": 3050,
      "y": 8100
    },
    {
      "id": "v43",
      "x": 4830,
      "y": 8100
    },
    {
      "id": "v44",
      "x": 6380,
      "y": 8100
    },
    {
      "id": "v45",
      "x": 8110,
      "y": 8100
    },
    {
      "id": "v46",
      "x": 9600,
      "y": 8100
    },
    {
      "id": "v47",
      "x": 11270,
      "y": 8100
    },
    {
      "id": "v48",
      "x": 12710,
      "y": 8100
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v17",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v13",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v6",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v14",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v15",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v9",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v8",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v16",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v25",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v34",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v33",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v26",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v27",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v36",
      "to": "v41",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v40",
      "to": "v35",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v35",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v29",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w47",
      "from": "v37",
      "to": "v43",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w49",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w50",
      "from": "v31",
      "to": "v38",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w51",
      "from": "v38",
      "to": "v45",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w53",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v34",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w55",
      "from": "v39",
      "to": "v48",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w56",
      "from": "v48",
      "to": "v47",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w57",
      "from": "v47",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w58",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w30",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w39",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 1260,
      "height": 2200
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w2",
      "position": 0.5,
      "width": 1430,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w40",
      "position": 0.5,
      "width": 1580,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w48",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w57",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w44",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39",
        "w40",
        "w5",
        "w4",
        "w16",
        "w15",
        "w19",
        "w26",
        "w25",
        "w24",
        "w28"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w3"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w41",
        "w38",
        "w37",
        "w46",
        "w47",
        "w48",
        "w49",
        "w42"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w46",
        "w36",
        "w35",
        "w50",
        "w51",
        "w52",
        "w53",
        "w47"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w50",
        "w34",
        "w33",
        "w32",
        "w54",
        "w55",
        "w56",
        "w57",
        "w58",
        "w51"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w41",
        "w42",
        "w43",
        "w44",
        "w45",
        "w39"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w17",
        "w18",
        "w19",
        "w14",
        "w13",
        "w20"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w27",
        "w28",
        "w23",
        "w29"
      ]
    },
    {
      "id": "r11",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w9",
        "w2",
        "w1",
        "w10"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SZ_SHENTIEJINGCHENG_151: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sz-shentiejingcheng-4br-151",
    "name": "深圳深铁璟城 4室2厅2卫1厨 151m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于深圳深铁璟城公开真实户型资料按正交几何简化重建；151.00m²为来源标注建筑面积，不等同于房间几何面积。模型约108.72m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1550,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3270,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5180,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6850,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8690,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10300,
      "y": 0
    },
    {
      "id": "v8",
      "x": 12080,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1570
    },
    {
      "id": "v10",
      "x": 3270,
      "y": 1570
    },
    {
      "id": "v11",
      "x": 5180,
      "y": 1570
    },
    {
      "id": "v12",
      "x": 8690,
      "y": 1570
    },
    {
      "id": "v13",
      "x": 10300,
      "y": 1570
    },
    {
      "id": "v14",
      "x": 12080,
      "y": 1570
    },
    {
      "id": "v15",
      "x": 0,
      "y": 3250
    },
    {
      "id": "v16",
      "x": 1550,
      "y": 3250
    },
    {
      "id": "v17",
      "x": 3270,
      "y": 3250
    },
    {
      "id": "v18",
      "x": 5180,
      "y": 3250
    },
    {
      "id": "v19",
      "x": 6850,
      "y": 3250
    },
    {
      "id": "v20",
      "x": 8690,
      "y": 3250
    },
    {
      "id": "v21",
      "x": 10300,
      "y": 3250
    },
    {
      "id": "v22",
      "x": 12080,
      "y": 3250
    },
    {
      "id": "v23",
      "x": 13630,
      "y": 3250
    },
    {
      "id": "v24",
      "x": 0,
      "y": 5020
    },
    {
      "id": "v25",
      "x": 1550,
      "y": 5020
    },
    {
      "id": "v26",
      "x": 3270,
      "y": 5020
    },
    {
      "id": "v27",
      "x": 5180,
      "y": 5020
    },
    {
      "id": "v28",
      "x": 6850,
      "y": 5020
    },
    {
      "id": "v29",
      "x": 8690,
      "y": 5020
    },
    {
      "id": "v30",
      "x": 10300,
      "y": 5020
    },
    {
      "id": "v31",
      "x": 12080,
      "y": 5020
    },
    {
      "id": "v32",
      "x": 13630,
      "y": 5020
    },
    {
      "id": "v33",
      "x": 0,
      "y": 6910
    },
    {
      "id": "v34",
      "x": 3270,
      "y": 6910
    },
    {
      "id": "v35",
      "x": 5180,
      "y": 6910
    },
    {
      "id": "v36",
      "x": 8690,
      "y": 6910
    },
    {
      "id": "v37",
      "x": 12080,
      "y": 6910
    },
    {
      "id": "v38",
      "x": 13630,
      "y": 6910
    },
    {
      "id": "v39",
      "x": 0,
      "y": 8530
    },
    {
      "id": "v40",
      "x": 1550,
      "y": 8530
    },
    {
      "id": "v41",
      "x": 3270,
      "y": 8530
    },
    {
      "id": "v42",
      "x": 5180,
      "y": 8530
    },
    {
      "id": "v43",
      "x": 6850,
      "y": 8530
    },
    {
      "id": "v44",
      "x": 8690,
      "y": 8530
    },
    {
      "id": "v45",
      "x": 10300,
      "y": 8530
    },
    {
      "id": "v46",
      "x": 12080,
      "y": 8530
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v10",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v15",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v7",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v14",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v8",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v24",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v22",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v23",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v37",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v22",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v33",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v26",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v41",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w45",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v39",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w47",
      "from": "v27",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w50",
      "from": "v29",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w51",
      "from": "v36",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w53",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v37",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w55",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w56",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w27",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w34",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w29",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 1590,
      "height": 2200
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w27",
      "position": 0.72,
      "width": 500,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w55",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w21",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w49",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w27",
        "w7",
        "w6",
        "w11",
        "w18",
        "w17",
        "w23",
        "w22",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w16",
        "w15",
        "w24"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w41",
        "w35",
        "w34",
        "w42",
        "w43",
        "w44",
        "w45",
        "w46"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w47",
        "w32",
        "w31",
        "w50",
        "w51",
        "w52",
        "w53",
        "w48"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w50",
        "w30",
        "w29",
        "w39",
        "w54",
        "w55",
        "w56",
        "w51"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w47",
        "w48",
        "w49",
        "w43",
        "w42",
        "w33"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w36",
        "w37",
        "w38",
        "w39",
        "w28",
        "w40"
      ]
    },
    {
      "id": "r11",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w25",
        "w20",
        "w19",
        "w26"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_CD_TIANFUHEMING_130: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-cd-tianfuhm-4br-130",
    "name": "成都天府和鸣 C1户型，4室2厅2卫1厨 130m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于成都天府和鸣公开真实户型资料按正交几何简化重建；130.00m²为来源标注建筑面积，不等同于房间几何面积。模型约101.41m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1440,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3060,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4840,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6390,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8120,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9620,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11290,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1710
    },
    {
      "id": "v10",
      "x": 3060,
      "y": 1710
    },
    {
      "id": "v11",
      "x": 4840,
      "y": 1710
    },
    {
      "id": "v12",
      "x": 8120,
      "y": 1710
    },
    {
      "id": "v13",
      "x": 11290,
      "y": 1710
    },
    {
      "id": "v14",
      "x": 12730,
      "y": 1710
    },
    {
      "id": "v15",
      "x": 0,
      "y": 3180
    },
    {
      "id": "v16",
      "x": 1440,
      "y": 3180
    },
    {
      "id": "v17",
      "x": 3060,
      "y": 3180
    },
    {
      "id": "v18",
      "x": 4840,
      "y": 3180
    },
    {
      "id": "v19",
      "x": 6390,
      "y": 3180
    },
    {
      "id": "v20",
      "x": 8120,
      "y": 3180
    },
    {
      "id": "v21",
      "x": 9620,
      "y": 3180
    },
    {
      "id": "v22",
      "x": 11290,
      "y": 3180
    },
    {
      "id": "v23",
      "x": 12730,
      "y": 3180
    },
    {
      "id": "v24",
      "x": 0,
      "y": 4740
    },
    {
      "id": "v25",
      "x": 1440,
      "y": 4740
    },
    {
      "id": "v26",
      "x": 3060,
      "y": 4740
    },
    {
      "id": "v27",
      "x": 4840,
      "y": 4740
    },
    {
      "id": "v28",
      "x": 6390,
      "y": 4740
    },
    {
      "id": "v29",
      "x": 8120,
      "y": 4740
    },
    {
      "id": "v30",
      "x": 9620,
      "y": 4740
    },
    {
      "id": "v31",
      "x": 11290,
      "y": 4740
    },
    {
      "id": "v32",
      "x": 12730,
      "y": 4740
    },
    {
      "id": "v33",
      "x": 0,
      "y": 6400
    },
    {
      "id": "v34",
      "x": 3060,
      "y": 6400
    },
    {
      "id": "v35",
      "x": 6390,
      "y": 6400
    },
    {
      "id": "v36",
      "x": 8120,
      "y": 6400
    },
    {
      "id": "v37",
      "x": 12730,
      "y": 6400
    },
    {
      "id": "v38",
      "x": 0,
      "y": 8160
    },
    {
      "id": "v39",
      "x": 1440,
      "y": 8160
    },
    {
      "id": "v40",
      "x": 3060,
      "y": 8160
    },
    {
      "id": "v41",
      "x": 4840,
      "y": 8160
    },
    {
      "id": "v42",
      "x": 6390,
      "y": 8160
    },
    {
      "id": "v43",
      "x": 8120,
      "y": 8160
    },
    {
      "id": "v44",
      "x": 9620,
      "y": 8160
    },
    {
      "id": "v45",
      "x": 11290,
      "y": 8160
    },
    {
      "id": "v46",
      "x": 12730,
      "y": 8160
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v10",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v15",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v11",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v8",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v14",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v23",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v31",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v24",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v33",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v34",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v38",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v29",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v36",
      "to": "v43",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v32",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v37",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w30",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w36",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 1380,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w43",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w47",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w21",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w30",
        "w7",
        "w6",
        "w11",
        "w18",
        "w17",
        "w24",
        "w23",
        "w28",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w15",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w38",
        "w37",
        "w36",
        "w39",
        "w40",
        "w41",
        "w42",
        "w43"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w39",
        "w35",
        "w34",
        "w44",
        "w45",
        "w46",
        "w47",
        "w40"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w48",
        "w32",
        "w31",
        "w27",
        "w51",
        "w52",
        "w53",
        "w54",
        "w55",
        "w49"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w48",
        "w49",
        "w50",
        "w45",
        "w44",
        "w33"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w26",
        "w27",
        "w28",
        "w22",
        "w29"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_HZ_WEIKECHENMINGFU_132: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-hz-weikechenmingfu-4br-132",
    "name": "杭州未珂宸铭府 C户型，4室2厅2卫1厨 132m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于杭州未珂宸铭府公开真实户型资料按正交几何简化重建；132.00m²为来源标注建筑面积，不等同于房间几何面积。模型约102.94m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1500,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3180,
      "y": 0
    },
    {
      "id": "v4",
      "x": 5040,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6660,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8460,
      "y": 0
    },
    {
      "id": "v7",
      "x": 10020,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11760,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1680
    },
    {
      "id": "v10",
      "x": 1500,
      "y": 1680
    },
    {
      "id": "v11",
      "x": 3180,
      "y": 1680
    },
    {
      "id": "v12",
      "x": 6660,
      "y": 1680
    },
    {
      "id": "v13",
      "x": 8460,
      "y": 1680
    },
    {
      "id": "v14",
      "x": 11760,
      "y": 1680
    },
    {
      "id": "v15",
      "x": 0,
      "y": 3460
    },
    {
      "id": "v16",
      "x": 1500,
      "y": 3460
    },
    {
      "id": "v17",
      "x": 3180,
      "y": 3460
    },
    {
      "id": "v18",
      "x": 5040,
      "y": 3460
    },
    {
      "id": "v19",
      "x": 6660,
      "y": 3460
    },
    {
      "id": "v20",
      "x": 8460,
      "y": 3460
    },
    {
      "id": "v21",
      "x": 10020,
      "y": 3460
    },
    {
      "id": "v22",
      "x": 11760,
      "y": 3460
    },
    {
      "id": "v23",
      "x": 13260,
      "y": 3460
    },
    {
      "id": "v24",
      "x": 0,
      "y": 4990
    },
    {
      "id": "v25",
      "x": 1500,
      "y": 4990
    },
    {
      "id": "v26",
      "x": 3180,
      "y": 4990
    },
    {
      "id": "v27",
      "x": 5040,
      "y": 4990
    },
    {
      "id": "v28",
      "x": 6660,
      "y": 4990
    },
    {
      "id": "v29",
      "x": 8460,
      "y": 4990
    },
    {
      "id": "v30",
      "x": 10020,
      "y": 4990
    },
    {
      "id": "v31",
      "x": 11760,
      "y": 4990
    },
    {
      "id": "v32",
      "x": 13260,
      "y": 4990
    },
    {
      "id": "v33",
      "x": 0,
      "y": 6620
    },
    {
      "id": "v34",
      "x": 3180,
      "y": 6620
    },
    {
      "id": "v35",
      "x": 6660,
      "y": 6620
    },
    {
      "id": "v36",
      "x": 10020,
      "y": 6620
    },
    {
      "id": "v37",
      "x": 11760,
      "y": 6620
    },
    {
      "id": "v38",
      "x": 13260,
      "y": 6620
    },
    {
      "id": "v39",
      "x": 0,
      "y": 8350
    },
    {
      "id": "v40",
      "x": 1500,
      "y": 8350
    },
    {
      "id": "v41",
      "x": 3180,
      "y": 8350
    },
    {
      "id": "v42",
      "x": 5040,
      "y": 8350
    },
    {
      "id": "v43",
      "x": 6660,
      "y": 8350
    },
    {
      "id": "v44",
      "x": 8460,
      "y": 8350
    },
    {
      "id": "v45",
      "x": 10020,
      "y": 8350
    },
    {
      "id": "v46",
      "x": 11760,
      "y": 8350
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v2",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v15",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v6",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v13",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v14",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v24",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v22",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v23",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v32",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w38",
      "from": "v38",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v37",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v22",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v33",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w42",
      "from": "v26",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v41",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w45",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w46",
      "from": "v39",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w47",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v35",
      "to": "v43",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w50",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v30",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v36",
      "to": "v45",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w54",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v37",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w56",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w27",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w29",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w34",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w18",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 1350,
      "height": 2200
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w1",
      "position": 0.5,
      "width": 1500,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w46",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w54",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w56",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w27",
        "w5",
        "w4",
        "w16",
        "w15",
        "w19",
        "w26",
        "w25",
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w17",
        "w21",
        "w22",
        "w23",
        "w24",
        "w25",
        "w26",
        "w18"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w3"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w41",
        "w35",
        "w34",
        "w42",
        "w43",
        "w44",
        "w45",
        "w46"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w42",
        "w33",
        "w32",
        "w47",
        "w48",
        "w49",
        "w50",
        "w43"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w47",
        "w31",
        "w30",
        "w51",
        "w52",
        "w53",
        "w54",
        "w48"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w39",
        "w55",
        "w56",
        "w52",
        "w51",
        "w29"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w17",
        "w18",
        "w19",
        "w14",
        "w13",
        "w20"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w36",
        "w37",
        "w38",
        "w39",
        "w28",
        "w40"
      ]
    },
    {
      "id": "r11",
      "type": "balcony",
      "name": "阳台二",
      "boundaryWallIds": [
        "w9",
        "w2",
        "w1",
        "w10"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_NJ_JINYUZIJINGFU_130: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-nj-jinyuzijingfu-4br-130",
    "name": "南京金隅紫京府 4室2厅2卫1厨 130m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于南京金隅紫京府公开真实户型资料按正交几何简化重建；130.00m²为来源标注建筑面积，不等同于房间几何面积。模型约100.96m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1450,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3070,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4860,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6420,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8150,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9660,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11330,
      "y": 0
    },
    {
      "id": "v9",
      "x": 12780,
      "y": 0
    },
    {
      "id": "v10",
      "x": 0,
      "y": 1520
    },
    {
      "id": "v11",
      "x": 3070,
      "y": 1520
    },
    {
      "id": "v12",
      "x": 4860,
      "y": 1520
    },
    {
      "id": "v13",
      "x": 8150,
      "y": 1520
    },
    {
      "id": "v14",
      "x": 11330,
      "y": 1520
    },
    {
      "id": "v15",
      "x": 12780,
      "y": 1520
    },
    {
      "id": "v16",
      "x": 0,
      "y": 3140
    },
    {
      "id": "v17",
      "x": 1450,
      "y": 3140
    },
    {
      "id": "v18",
      "x": 3070,
      "y": 3140
    },
    {
      "id": "v19",
      "x": 4860,
      "y": 3140
    },
    {
      "id": "v20",
      "x": 6420,
      "y": 3140
    },
    {
      "id": "v21",
      "x": 8150,
      "y": 3140
    },
    {
      "id": "v22",
      "x": 9660,
      "y": 3140
    },
    {
      "id": "v23",
      "x": 11330,
      "y": 3140
    },
    {
      "id": "v24",
      "x": 12780,
      "y": 3140
    },
    {
      "id": "v25",
      "x": 0,
      "y": 4860
    },
    {
      "id": "v26",
      "x": 1450,
      "y": 4860
    },
    {
      "id": "v27",
      "x": 3070,
      "y": 4860
    },
    {
      "id": "v28",
      "x": 4860,
      "y": 4860
    },
    {
      "id": "v29",
      "x": 6420,
      "y": 4860
    },
    {
      "id": "v30",
      "x": 8150,
      "y": 4860
    },
    {
      "id": "v31",
      "x": 9660,
      "y": 4860
    },
    {
      "id": "v32",
      "x": 11330,
      "y": 4860
    },
    {
      "id": "v33",
      "x": 12780,
      "y": 4860
    },
    {
      "id": "v34",
      "x": 0,
      "y": 6330
    },
    {
      "id": "v35",
      "x": 1450,
      "y": 6330
    },
    {
      "id": "v36",
      "x": 4860,
      "y": 6330
    },
    {
      "id": "v37",
      "x": 8150,
      "y": 6330
    },
    {
      "id": "v38",
      "x": 12780,
      "y": 6330
    },
    {
      "id": "v39",
      "x": 0,
      "y": 7900
    },
    {
      "id": "v40",
      "x": 1450,
      "y": 7900
    },
    {
      "id": "v41",
      "x": 3070,
      "y": 7900
    },
    {
      "id": "v42",
      "x": 4860,
      "y": 7900
    },
    {
      "id": "v43",
      "x": 6420,
      "y": 7900
    },
    {
      "id": "v44",
      "x": 8150,
      "y": 7900
    },
    {
      "id": "v45",
      "x": 9660,
      "y": 7900
    },
    {
      "id": "v46",
      "x": 11330,
      "y": 7900
    },
    {
      "id": "v47",
      "x": 12780,
      "y": 7900
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v10",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v11",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v16",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v13",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v8",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v14",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v9",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v8",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v15",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v24",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v33",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v39",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v36",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v30",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v37",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w52",
      "from": "v33",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v38",
      "to": "v47",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w54",
      "from": "v47",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w56",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w28",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w26",
      "position": 0.5,
      "width": 1270,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 1540,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w55",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w46",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w7",
        "w6",
        "w11",
        "w18",
        "w17",
        "w24",
        "w23",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w15",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w10"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w48",
        "w32",
        "w31",
        "w30",
        "w52",
        "w53",
        "w54",
        "w55",
        "w56",
        "w49"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w44",
        "w34",
        "w33",
        "w48",
        "w49",
        "w50",
        "w51",
        "w45"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w39",
        "w36",
        "w35",
        "w44",
        "w45",
        "w46",
        "w47",
        "w40"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w39",
        "w40",
        "w41",
        "w42",
        "w43",
        "w37"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w26",
        "w21",
        "w27"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_WH_ZHAOSHANGTIANQINGFU_130: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-wh-zhaoshangtianqingfu-4br-130",
    "name": "武汉招商天青府 雨霁（偶数层），4室2厅2卫1厨 130m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于武汉招商天青府公开真实户型资料按正交几何简化重建；130.00m²为来源标注建筑面积，不等同于房间几何面积。模型约101.33m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1430,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3040,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4810,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6350,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8070,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9560,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11220,
      "y": 0
    },
    {
      "id": "v9",
      "x": 12650,
      "y": 0
    },
    {
      "id": "v10",
      "x": 0,
      "y": 1750
    },
    {
      "id": "v11",
      "x": 3040,
      "y": 1750
    },
    {
      "id": "v12",
      "x": 4810,
      "y": 1750
    },
    {
      "id": "v13",
      "x": 8070,
      "y": 1750
    },
    {
      "id": "v14",
      "x": 11220,
      "y": 1750
    },
    {
      "id": "v15",
      "x": 12650,
      "y": 1750
    },
    {
      "id": "v16",
      "x": 0,
      "y": 3250
    },
    {
      "id": "v17",
      "x": 1430,
      "y": 3250
    },
    {
      "id": "v18",
      "x": 3040,
      "y": 3250
    },
    {
      "id": "v19",
      "x": 4810,
      "y": 3250
    },
    {
      "id": "v20",
      "x": 6350,
      "y": 3250
    },
    {
      "id": "v21",
      "x": 8070,
      "y": 3250
    },
    {
      "id": "v22",
      "x": 9560,
      "y": 3250
    },
    {
      "id": "v23",
      "x": 11220,
      "y": 3250
    },
    {
      "id": "v24",
      "x": 12650,
      "y": 3250
    },
    {
      "id": "v25",
      "x": 0,
      "y": 4860
    },
    {
      "id": "v26",
      "x": 1430,
      "y": 4860
    },
    {
      "id": "v27",
      "x": 3040,
      "y": 4860
    },
    {
      "id": "v28",
      "x": 4810,
      "y": 4860
    },
    {
      "id": "v29",
      "x": 6350,
      "y": 4860
    },
    {
      "id": "v30",
      "x": 8070,
      "y": 4860
    },
    {
      "id": "v31",
      "x": 9560,
      "y": 4860
    },
    {
      "id": "v32",
      "x": 11220,
      "y": 4860
    },
    {
      "id": "v33",
      "x": 12650,
      "y": 4860
    },
    {
      "id": "v34",
      "x": 0,
      "y": 6560
    },
    {
      "id": "v35",
      "x": 1430,
      "y": 6560
    },
    {
      "id": "v36",
      "x": 4810,
      "y": 6560
    },
    {
      "id": "v37",
      "x": 8070,
      "y": 6560
    },
    {
      "id": "v38",
      "x": 12650,
      "y": 6560
    },
    {
      "id": "v39",
      "x": 0,
      "y": 8010
    },
    {
      "id": "v40",
      "x": 1430,
      "y": 8010
    },
    {
      "id": "v41",
      "x": 3040,
      "y": 8010
    },
    {
      "id": "v42",
      "x": 4810,
      "y": 8010
    },
    {
      "id": "v43",
      "x": 6350,
      "y": 8010
    },
    {
      "id": "v44",
      "x": 8070,
      "y": 8010
    },
    {
      "id": "v45",
      "x": 9560,
      "y": 8010
    },
    {
      "id": "v46",
      "x": 11220,
      "y": 8010
    },
    {
      "id": "v47",
      "x": 12650,
      "y": 8010
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v10",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v11",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v16",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v13",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v8",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v14",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v9",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w27",
      "from": "v8",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v15",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v24",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v33",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v35",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v39",
      "to": "v34",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w43",
      "from": "v34",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v36",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v30",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v37",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w52",
      "from": "v33",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v38",
      "to": "v47",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w54",
      "from": "v47",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v46",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w56",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w28",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w31",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w26",
      "position": 0.5,
      "width": 1250,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w38",
      "position": 0.5,
      "width": 1430,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w46",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w52",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w43",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w28",
        "w29",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w7",
        "w6",
        "w11",
        "w18",
        "w17",
        "w24",
        "w23",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w10"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w15",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w16"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w39",
        "w36",
        "w35",
        "w44",
        "w45",
        "w46",
        "w47",
        "w40"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w44",
        "w34",
        "w33",
        "w48",
        "w49",
        "w50",
        "w51",
        "w45"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w48",
        "w32",
        "w31",
        "w30",
        "w52",
        "w53",
        "w54",
        "w55",
        "w56",
        "w49"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w39",
        "w40",
        "w41",
        "w42",
        "w43",
        "w37"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w26",
        "w21",
        "w27"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_WH_JINRONGJIEJINYUEFU_130: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-wh-jinrongjiejinyuefu-4br-130",
    "name": "武汉金融街金悦府 4室2厅2卫1厨 130m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于武汉金融街金悦府公开真实户型资料按正交几何简化重建；130.00m²为来源标注建筑面积，不等同于房间几何面积。模型约101.40m²，按基于建筑面积与公开空间信息拟合的室内建模面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1470,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3110,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4930,
      "y": 0
    },
    {
      "id": "v5",
      "x": 6510,
      "y": 0
    },
    {
      "id": "v6",
      "x": 8270,
      "y": 0
    },
    {
      "id": "v7",
      "x": 9800,
      "y": 0
    },
    {
      "id": "v8",
      "x": 11500,
      "y": 0
    },
    {
      "id": "v9",
      "x": 0,
      "y": 1690
    },
    {
      "id": "v10",
      "x": 3110,
      "y": 1690
    },
    {
      "id": "v11",
      "x": 6510,
      "y": 1690
    },
    {
      "id": "v12",
      "x": 8270,
      "y": 1690
    },
    {
      "id": "v13",
      "x": 11500,
      "y": 1690
    },
    {
      "id": "v14",
      "x": 0,
      "y": 3480
    },
    {
      "id": "v15",
      "x": 1470,
      "y": 3480
    },
    {
      "id": "v16",
      "x": 3110,
      "y": 3480
    },
    {
      "id": "v17",
      "x": 4930,
      "y": 3480
    },
    {
      "id": "v18",
      "x": 6510,
      "y": 3480
    },
    {
      "id": "v19",
      "x": 8270,
      "y": 3480
    },
    {
      "id": "v20",
      "x": 9800,
      "y": 3480
    },
    {
      "id": "v21",
      "x": 11500,
      "y": 3480
    },
    {
      "id": "v22",
      "x": 12970,
      "y": 3480
    },
    {
      "id": "v23",
      "x": 0,
      "y": 5030
    },
    {
      "id": "v24",
      "x": 1470,
      "y": 5030
    },
    {
      "id": "v25",
      "x": 3110,
      "y": 5030
    },
    {
      "id": "v26",
      "x": 4930,
      "y": 5030
    },
    {
      "id": "v27",
      "x": 6510,
      "y": 5030
    },
    {
      "id": "v28",
      "x": 8270,
      "y": 5030
    },
    {
      "id": "v29",
      "x": 9800,
      "y": 5030
    },
    {
      "id": "v30",
      "x": 11500,
      "y": 5030
    },
    {
      "id": "v31",
      "x": 12970,
      "y": 5030
    },
    {
      "id": "v32",
      "x": 0,
      "y": 6670
    },
    {
      "id": "v33",
      "x": 1470,
      "y": 6670
    },
    {
      "id": "v34",
      "x": 4930,
      "y": 6670
    },
    {
      "id": "v35",
      "x": 8270,
      "y": 6670
    },
    {
      "id": "v36",
      "x": 11500,
      "y": 6670
    },
    {
      "id": "v37",
      "x": 12970,
      "y": 6670
    },
    {
      "id": "v38",
      "x": 1470,
      "y": 8410
    },
    {
      "id": "v39",
      "x": 3110,
      "y": 8410
    },
    {
      "id": "v40",
      "x": 4930,
      "y": 8410
    },
    {
      "id": "v41",
      "x": 6510,
      "y": 8410
    },
    {
      "id": "v42",
      "x": 8270,
      "y": 8410
    },
    {
      "id": "v43",
      "x": 9800,
      "y": 8410
    },
    {
      "id": "v44",
      "x": 11500,
      "y": 8410
    },
    {
      "id": "v45",
      "x": 12970,
      "y": 8410
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v9",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v10",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v15",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v14",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v11",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v19",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w21",
      "from": "v8",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v13",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v15",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v24",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v33",
      "to": "v32",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v32",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v23",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v21",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w31",
      "from": "v22",
      "to": "v31",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v30",
      "to": "v29",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w35",
      "from": "v28",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w37",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v26",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w40",
      "from": "v34",
      "to": "v40",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w41",
      "from": "v40",
      "to": "v39",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v39",
      "to": "v38",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v38",
      "to": "v33",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w44",
      "from": "v28",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w45",
      "from": "v35",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v42",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v41",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w48",
      "from": "v30",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v36",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w50",
      "from": "v44",
      "to": "v43",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w51",
      "from": "v43",
      "to": "v42",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w52",
      "from": "v31",
      "to": "v37",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v37",
      "to": "v45",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w54",
      "from": "v45",
      "to": "v44",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w30",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w32",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w33",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 1370,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w31",
      "position": 0.5,
      "width": 1370,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w22",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w41",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w46",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w9",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w53",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w25",
        "w6",
        "w14",
        "w13",
        "w17",
        "w24",
        "w23",
        "w30",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w5"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w15",
        "w19",
        "w20",
        "w21",
        "w22",
        "w23",
        "w24",
        "w16"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w26",
        "w38",
        "w37",
        "w39",
        "w40",
        "w41",
        "w42",
        "w43"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w39",
        "w36",
        "w35",
        "w44",
        "w45",
        "w46",
        "w47",
        "w40"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w44",
        "w34",
        "w33",
        "w48",
        "w49",
        "w50",
        "w51",
        "w45"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w52",
        "w53",
        "w54",
        "w49",
        "w48",
        "w32"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w15",
        "w16",
        "w17",
        "w12",
        "w11",
        "w18"
      ]
    },
    {
      "id": "r10",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w25",
        "w26",
        "w27",
        "w28",
        "w29",
        "w7"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_WEIFANGER_1BR0_36: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-weifanger-1br0-36",
    "name": "上海潍坊二村 1室0厅1卫1厨 36m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海潍坊二村公开真实户型资料按正交几何简化重建；35.57m²为来源标注建筑面积，不等同于房间几何面积。模型约35.52m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1330,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2820,
      "y": 0
    },
    {
      "id": "v4",
      "x": 4470,
      "y": 0
    },
    {
      "id": "v5",
      "x": 5910,
      "y": 0
    },
    {
      "id": "v6",
      "x": 0,
      "y": 1450
    },
    {
      "id": "v7",
      "x": 1330,
      "y": 1450
    },
    {
      "id": "v8",
      "x": 2820,
      "y": 1450
    },
    {
      "id": "v9",
      "x": 5910,
      "y": 1450
    },
    {
      "id": "v10",
      "x": 0,
      "y": 2980
    },
    {
      "id": "v11",
      "x": 1330,
      "y": 2980
    },
    {
      "id": "v12",
      "x": 2820,
      "y": 2980
    },
    {
      "id": "v13",
      "x": 5910,
      "y": 2980
    },
    {
      "id": "v14",
      "x": 0,
      "y": 4610
    },
    {
      "id": "v15",
      "x": 2820,
      "y": 4610
    },
    {
      "id": "v16",
      "x": 4470,
      "y": 4610
    },
    {
      "id": "v17",
      "x": 5910,
      "y": 4610
    },
    {
      "id": "v18",
      "x": 0,
      "y": 6010
    },
    {
      "id": "v19",
      "x": 1330,
      "y": 6010
    },
    {
      "id": "v20",
      "x": 2820,
      "y": 6010
    },
    {
      "id": "v21",
      "x": 4470,
      "y": 6010
    },
    {
      "id": "v22",
      "x": 5910,
      "y": 6010
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w2",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w4",
      "from": "v8",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v6",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v13",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v15",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v12",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v11",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v10",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v14",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v15",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v20",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v19",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v17",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v22",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 1470,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w7",
      "position": 0.5,
      "width": 1470,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "入户与起居公共区（原户型无独立客厅）",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w8",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w19",
        "w17",
        "w16",
        "w14",
        "w20",
        "w21",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r4",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w15",
        "w16",
        "w17",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w13",
        "w12",
        "w24",
        "w25",
        "w26",
        "w20"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_SH_WEIFANGER_2BR0_44: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-sh-weifanger-2br0-44",
    "name": "上海潍坊二村 2室0厅1卫1厨 44m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于上海潍坊二村公开真实户型资料按正交几何简化重建；43.89m²为来源标注建筑面积，不等同于房间几何面积。模型约36.13m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1120,
      "y": 0
    },
    {
      "id": "v3",
      "x": 2380,
      "y": 0
    },
    {
      "id": "v4",
      "x": 3760,
      "y": 0
    },
    {
      "id": "v5",
      "x": 4970,
      "y": 0
    },
    {
      "id": "v6",
      "x": 6320,
      "y": 0
    },
    {
      "id": "v7",
      "x": 0,
      "y": 1140
    },
    {
      "id": "v8",
      "x": 2380,
      "y": 1140
    },
    {
      "id": "v9",
      "x": 4970,
      "y": 1140
    },
    {
      "id": "v10",
      "x": 6320,
      "y": 1140
    },
    {
      "id": "v11",
      "x": 0,
      "y": 2360
    },
    {
      "id": "v12",
      "x": 1120,
      "y": 2360
    },
    {
      "id": "v13",
      "x": 2380,
      "y": 2360
    },
    {
      "id": "v14",
      "x": 4970,
      "y": 2360
    },
    {
      "id": "v15",
      "x": 6320,
      "y": 2360
    },
    {
      "id": "v16",
      "x": 0,
      "y": 3650
    },
    {
      "id": "v17",
      "x": 1120,
      "y": 3650
    },
    {
      "id": "v18",
      "x": 2380,
      "y": 3650
    },
    {
      "id": "v19",
      "x": 4970,
      "y": 3650
    },
    {
      "id": "v20",
      "x": 6320,
      "y": 3650
    },
    {
      "id": "v21",
      "x": 0,
      "y": 5020
    },
    {
      "id": "v22",
      "x": 2380,
      "y": 5020
    },
    {
      "id": "v23",
      "x": 3760,
      "y": 5020
    },
    {
      "id": "v24",
      "x": 4970,
      "y": 5020
    },
    {
      "id": "v25",
      "x": 6320,
      "y": 5020
    },
    {
      "id": "v26",
      "x": 0,
      "y": 6200
    },
    {
      "id": "v27",
      "x": 1120,
      "y": 6200
    },
    {
      "id": "v28",
      "x": 2380,
      "y": 6200
    },
    {
      "id": "v29",
      "x": 4970,
      "y": 6200
    },
    {
      "id": "v30",
      "x": 6320,
      "y": 6200
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v7",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v8",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v13",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v12",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v11",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v9",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v14",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v19",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v24",
      "to": "v23",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v23",
      "to": "v22",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v22",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v18",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v17",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w20",
      "from": "v16",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v15",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w26",
      "from": "v21",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v22",
      "to": "v28",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v28",
      "to": "v27",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v27",
      "to": "v26",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v26",
      "to": "v21",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v20",
      "to": "v25",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w32",
      "from": "v25",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w33",
      "from": "v30",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w34",
      "from": "v29",
      "to": "v24",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1200,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1190,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w3",
      "position": 0.5,
      "width": 1080,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "餐区与入户公共区（原户型无独立客厅）",
      "boundaryWallIds": [
        "w5",
        "w4",
        "w9",
        "w10",
        "w11",
        "w12",
        "w13",
        "w14",
        "w15",
        "w16",
        "w17",
        "w18",
        "w19",
        "w20",
        "w7",
        "w6"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w21",
        "w22",
        "w23",
        "w24",
        "w13",
        "w12",
        "w11",
        "w25"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w26",
        "w19",
        "w18",
        "w17",
        "w27",
        "w28",
        "w29",
        "w30"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w31",
        "w32",
        "w33",
        "w34",
        "w14",
        "w24"
      ]
    }
  ],
  "furniture": []
};


export const PLAN_CN_GZ_BAOLITIANYUE_251: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "plan-cn-gz-baolitianyue-5br-251",
    "name": "广州保利天悦 5室2厅4卫1厨 251m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-19T00:00:00.000Z",
    "updatedAt": "2026-09-19T00:00:00.000Z",
    "description": "基于广州保利天悦公开真实户型资料按正交几何简化重建；251.00m²为来源标注建筑面积，不等同于房间几何面积。模型约206.04m²，按来源套内面积校准。保留公开资料可确认的主要房间、厨卫、公共区与阳台邻接关系；精确墙长以原始户型图复核为准。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 1810,
      "y": 0
    },
    {
      "id": "v3",
      "x": 3820,
      "y": 0
    },
    {
      "id": "v4",
      "x": 6050,
      "y": 0
    },
    {
      "id": "v5",
      "x": 8000,
      "y": 0
    },
    {
      "id": "v6",
      "x": 10160,
      "y": 0
    },
    {
      "id": "v7",
      "x": 12040,
      "y": 0
    },
    {
      "id": "v8",
      "x": 14120,
      "y": 0
    },
    {
      "id": "v9",
      "x": 15930,
      "y": 0
    },
    {
      "id": "v10",
      "x": 17950,
      "y": 0
    },
    {
      "id": "v11",
      "x": 20180,
      "y": 0
    },
    {
      "id": "v12",
      "x": 0,
      "y": 2140
    },
    {
      "id": "v13",
      "x": 3820,
      "y": 2140
    },
    {
      "id": "v14",
      "x": 6050,
      "y": 2140
    },
    {
      "id": "v15",
      "x": 8000,
      "y": 2140
    },
    {
      "id": "v16",
      "x": 12040,
      "y": 2140
    },
    {
      "id": "v17",
      "x": 15930,
      "y": 2140
    },
    {
      "id": "v18",
      "x": 20180,
      "y": 2140
    },
    {
      "id": "v19",
      "x": 0,
      "y": 3970
    },
    {
      "id": "v20",
      "x": 1810,
      "y": 3970
    },
    {
      "id": "v21",
      "x": 3820,
      "y": 3970
    },
    {
      "id": "v22",
      "x": 6050,
      "y": 3970
    },
    {
      "id": "v23",
      "x": 8000,
      "y": 3970
    },
    {
      "id": "v24",
      "x": 10160,
      "y": 3970
    },
    {
      "id": "v25",
      "x": 12040,
      "y": 3970
    },
    {
      "id": "v26",
      "x": 14120,
      "y": 3970
    },
    {
      "id": "v27",
      "x": 15930,
      "y": 3970
    },
    {
      "id": "v28",
      "x": 17950,
      "y": 3970
    },
    {
      "id": "v29",
      "x": 20180,
      "y": 3970
    },
    {
      "id": "v30",
      "x": 0,
      "y": 5930
    },
    {
      "id": "v31",
      "x": 1810,
      "y": 5930
    },
    {
      "id": "v32",
      "x": 3820,
      "y": 5930
    },
    {
      "id": "v33",
      "x": 6050,
      "y": 5930
    },
    {
      "id": "v34",
      "x": 8000,
      "y": 5930
    },
    {
      "id": "v35",
      "x": 10160,
      "y": 5930
    },
    {
      "id": "v36",
      "x": 12040,
      "y": 5930
    },
    {
      "id": "v37",
      "x": 14120,
      "y": 5930
    },
    {
      "id": "v38",
      "x": 15930,
      "y": 5930
    },
    {
      "id": "v39",
      "x": 17950,
      "y": 5930
    },
    {
      "id": "v40",
      "x": 20180,
      "y": 5930
    },
    {
      "id": "v41",
      "x": 0,
      "y": 8010
    },
    {
      "id": "v42",
      "x": 1810,
      "y": 8010
    },
    {
      "id": "v43",
      "x": 6050,
      "y": 8010
    },
    {
      "id": "v44",
      "x": 10160,
      "y": 8010
    },
    {
      "id": "v45",
      "x": 14120,
      "y": 8010
    },
    {
      "id": "v46",
      "x": 20180,
      "y": 8010
    },
    {
      "id": "v47",
      "x": 0,
      "y": 10210
    },
    {
      "id": "v48",
      "x": 1810,
      "y": 10210
    },
    {
      "id": "v49",
      "x": 3820,
      "y": 10210
    },
    {
      "id": "v50",
      "x": 6050,
      "y": 10210
    },
    {
      "id": "v51",
      "x": 8000,
      "y": 10210
    },
    {
      "id": "v52",
      "x": 10160,
      "y": 10210
    },
    {
      "id": "v53",
      "x": 12040,
      "y": 10210
    },
    {
      "id": "v54",
      "x": 14120,
      "y": 10210
    },
    {
      "id": "v55",
      "x": 15930,
      "y": 10210
    },
    {
      "id": "v56",
      "x": 17950,
      "y": 10210
    },
    {
      "id": "v57",
      "x": 20180,
      "y": 10210
    }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v12",
      "to": "v1",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w2",
      "from": "v1",
      "to": "v2",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v2",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v3",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w5",
      "from": "v13",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w6",
      "from": "v21",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v20",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v19",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v22",
      "to": "v21",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v3",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v5",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v15",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v23",
      "to": "v22",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v4",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w17",
      "from": "v5",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w19",
      "from": "v7",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v16",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v25",
      "to": "v24",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w22",
      "from": "v24",
      "to": "v23",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w23",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w24",
      "from": "v8",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w25",
      "from": "v9",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v17",
      "to": "v27",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v27",
      "to": "v26",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w28",
      "from": "v26",
      "to": "v25",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w29",
      "from": "v31",
      "to": "v30",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w30",
      "from": "v30",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w31",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w32",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w33",
      "from": "v11",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w34",
      "from": "v18",
      "to": "v29",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w35",
      "from": "v29",
      "to": "v28",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w36",
      "from": "v28",
      "to": "v39",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w37",
      "from": "v39",
      "to": "v38",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w38",
      "from": "v38",
      "to": "v37",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w39",
      "from": "v37",
      "to": "v36",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w40",
      "from": "v36",
      "to": "v35",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w41",
      "from": "v35",
      "to": "v34",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w42",
      "from": "v34",
      "to": "v33",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w43",
      "from": "v33",
      "to": "v32",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w44",
      "from": "v32",
      "to": "v31",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w45",
      "from": "v29",
      "to": "v40",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w46",
      "from": "v40",
      "to": "v39",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w47",
      "from": "v31",
      "to": "v42",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w48",
      "from": "v42",
      "to": "v48",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w49",
      "from": "v48",
      "to": "v47",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w50",
      "from": "v47",
      "to": "v41",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w51",
      "from": "v41",
      "to": "v30",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w52",
      "from": "v33",
      "to": "v43",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w53",
      "from": "v43",
      "to": "v50",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w54",
      "from": "v50",
      "to": "v49",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w55",
      "from": "v49",
      "to": "v48",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w56",
      "from": "v35",
      "to": "v44",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w57",
      "from": "v44",
      "to": "v52",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w58",
      "from": "v52",
      "to": "v51",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w59",
      "from": "v51",
      "to": "v50",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w60",
      "from": "v37",
      "to": "v45",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w61",
      "from": "v45",
      "to": "v54",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w62",
      "from": "v54",
      "to": "v53",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w63",
      "from": "v53",
      "to": "v52",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w64",
      "from": "v40",
      "to": "v46",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w65",
      "from": "v46",
      "to": "v57",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w66",
      "from": "v57",
      "to": "v56",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w67",
      "from": "v56",
      "to": "v55",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w68",
      "from": "v55",
      "to": "v54",
      "thickness": 200,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w34",
      "position": 0.28,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 850,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w29",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w41",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w43",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w39",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w37",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w13",
      "position": 0.5,
      "width": 700,
      "height": 2100
    },
    {
      "id": "d12",
      "type": "door",
      "wallId": "w35",
      "position": 0.5,
      "width": 1600,
      "height": 2200
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w32",
      "position": 0.5,
      "width": 1800,
      "height": 1500
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w54",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w62",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w66",
      "position": 0.5,
      "width": 1400,
      "height": 1500
    },
    {
      "id": "win7",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1000,
      "height": 1000
    },
    {
      "id": "win8",
      "type": "window",
      "wallId": "w50",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win9",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 800,
      "height": 1000
    },
    {
      "id": "win10",
      "type": "window",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 1000
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客餐厅与玄关",
      "boundaryWallIds": [
        "w29",
        "w30",
        "w7",
        "w6",
        "w11",
        "w15",
        "w22",
        "w21",
        "w28",
        "w27",
        "w26",
        "w25",
        "w31",
        "w32",
        "w33",
        "w34",
        "w35",
        "w36",
        "w37",
        "w38",
        "w39",
        "w40",
        "w41",
        "w42",
        "w43",
        "w44"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6",
        "w7",
        "w8"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "主卧",
      "boundaryWallIds": [
        "w13",
        "w17",
        "w18",
        "w19",
        "w20",
        "w21",
        "w22",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧一",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w11",
        "w5",
        "w4",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧二",
      "boundaryWallIds": [
        "w47",
        "w44",
        "w43",
        "w52",
        "w53",
        "w54",
        "w55",
        "w48"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧三",
      "boundaryWallIds": [
        "w56",
        "w40",
        "w39",
        "w60",
        "w61",
        "w62",
        "w63",
        "w57"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "次卧四",
      "boundaryWallIds": [
        "w60",
        "w38",
        "w37",
        "w46",
        "w64",
        "w65",
        "w66",
        "w67",
        "w68",
        "w61"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "公卫",
      "boundaryWallIds": [
        "w47",
        "w48",
        "w49",
        "w50",
        "w51",
        "w29"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫",
      "boundaryWallIds": [
        "w13",
        "w14",
        "w15",
        "w10",
        "w9",
        "w16"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "次卫",
      "boundaryWallIds": [
        "w19",
        "w23",
        "w24",
        "w25",
        "w26",
        "w27",
        "w28",
        "w20"
      ]
    },
    {
      "id": "r11",
      "type": "bathroom",
      "name": "客卫",
      "boundaryWallIds": [
        "w52",
        "w42",
        "w41",
        "w56",
        "w57",
        "w58",
        "w59",
        "w53"
      ]
    },
    {
      "id": "r12",
      "type": "balcony",
      "name": "客厅阳台",
      "boundaryWallIds": [
        "w45",
        "w46",
        "w36",
        "w35"
      ]
    }
  ],
  "furniture": []
};
