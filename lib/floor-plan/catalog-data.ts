/**
 * 中国城市住宅代表性标准户型（标准化重绘）
 * 生成日期：2026-09-18
 *
 * 注意：这些是根据公开规范和常见商品住宅/保障房空间组织归纳的“原型”，
 * 不是施工图，也不对应某一个具体楼盘。实际项目须由有资质的建筑专业人员复核。
 */

import type { StandardFloorPlan } from "@/lib/floor-plan/types";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "./fixtures/standard-plans";

/**
 * The single source of truth for floor plans available in the UI catalogue.
 *
 * Each entry uses `floor-plan-cn-{layout}-{sequence}` as a stable ID.
 */
export const PLAN_CN_STUDIO_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-studio-01",
    "name": "紧凑开间 27m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "适合单人居住的最小完整套型，起居与睡眠复合使用。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 4800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 0,
      "y": 3500
    },
    {
      "id": "v4",
      "x": 2700,
      "y": 3500
    },
    {
      "id": "v5",
      "x": 4800,
      "y": 3500
    },
    {
      "id": "v6",
      "x": 0,
      "y": 5600
    },
    {
      "id": "v7",
      "x": 2700,
      "y": 5600
    },
    {
      "id": "v8",
      "x": 4800,
      "y": 5600
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
      "from": "v3",
      "to": "v4",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v1",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w1",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w2",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "起居卧室",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w6",
        "w8"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "独立厨房",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w7",
        "w10"
      ]
    },
    {
      "id": "r3",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w10"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 2400,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 4400,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_STUDIO_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-studio-02",
    "name": "长租公寓开间 30m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "面向长租公寓的方正开间，厨卫集中布置。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 0,
      "y": 3800
    },
    {
      "id": "v4",
      "x": 2200,
      "y": 3800
    },
    {
      "id": "v5",
      "x": 5000,
      "y": 3800
    },
    {
      "id": "v6",
      "x": 0,
      "y": 6000
    },
    {
      "id": "v7",
      "x": 2200,
      "y": 6000
    },
    {
      "id": "v8",
      "x": 5000,
      "y": 6000
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
      "from": "v3",
      "to": "v4",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v1",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w1",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w2",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w5",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "起居卧室",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w6",
        "w8"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "独立厨房",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w10"
      ]
    },
    {
      "id": "r3",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w7",
        "w10"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 2500,
      "y": 1900,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 4600,
      "y": 3400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_STUDIO_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-studio-03",
    "name": "带独立厨房开间 34m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "较宽开间提供完整收纳墙与独立烹饪空间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5400,
      "y": 0
    },
    {
      "id": "v3",
      "x": 0,
      "y": 4000
    },
    {
      "id": "v4",
      "x": 3000,
      "y": 4000
    },
    {
      "id": "v5",
      "x": 5400,
      "y": 4000
    },
    {
      "id": "v6",
      "x": 0,
      "y": 6300
    },
    {
      "id": "v7",
      "x": 3000,
      "y": 6300
    },
    {
      "id": "v8",
      "x": 5400,
      "y": 6300
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
      "from": "v3",
      "to": "v4",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w3",
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v6",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v1",
      "to": "v3",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w7",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v5",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v4",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w1",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w2",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w6",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w4",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "起居卧室",
      "boundaryWallIds": [
        "w1",
        "w2",
        "w3",
        "w6",
        "w8"
      ]
    },
    {
      "id": "r2",
      "type": "kitchen",
      "name": "独立厨房",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w7",
        "w10"
      ]
    },
    {
      "id": "r3",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w10"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 2700,
      "y": 2000,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 5000,
      "y": 3600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_1B1L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-01",
    "name": "紧凑一室一厅 38m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "小面积刚需原型，客餐合一并压缩交通面积。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 6000,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 4700
    },
    {
      "id": "v5",
      "x": 3600,
      "y": 4700
    },
    {
      "id": "v6",
      "x": 6000,
      "y": 4700
    },
    {
      "id": "v7",
      "x": 3600,
      "y": 2400
    },
    {
      "id": "v8",
      "x": 6000,
      "y": 2400
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6300
    },
    {
      "id": "v10",
      "x": 3600,
      "y": 6300
    },
    {
      "id": "v11",
      "x": 6000,
      "y": 6300
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v7",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v3",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v8",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w6",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
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
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w8",
        "w10",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w10",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w4",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w9",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 2350,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 3150,
      "y": 2350,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 4800,
      "y": 1200,
      "width": 1500,
      "depth": 1800,
      "rotation": 90
    }
  ]
};

export const PLAN_CN_1B1L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-02",
    "name": "南向一室一厅 42m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "主要居室朝向同一采光面，适合中间户。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2500,
      "y": 0
    },
    {
      "id": "v3",
      "x": 6300,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 4900
    },
    {
      "id": "v5",
      "x": 2500,
      "y": 4900
    },
    {
      "id": "v6",
      "x": 6300,
      "y": 4900
    },
    {
      "id": "v7",
      "x": 0,
      "y": 2500
    },
    {
      "id": "v8",
      "x": 2500,
      "y": 2500
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6600
    },
    {
      "id": "v10",
      "x": 2500,
      "y": 6600
    },
    {
      "id": "v11",
      "x": 6300,
      "y": 6600
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v8",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v1",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w7",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w8",
        "w9",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w5",
        "w8",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w10",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w10",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 3700,
      "y": 2450,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 5850,
      "y": 2450,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 1250,
      "y": 1250,
      "width": 1500,
      "depth": 1800,
      "rotation": 90
    }
  ]
};

export const PLAN_CN_1B1L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-03",
    "name": "通廊一室一厅 46m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "玄关通廊串联厨卫与起居空间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 4000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 6600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 5100
    },
    {
      "id": "v5",
      "x": 4000,
      "y": 5100
    },
    {
      "id": "v6",
      "x": 6600,
      "y": 5100
    },
    {
      "id": "v7",
      "x": 4000,
      "y": 2600
    },
    {
      "id": "v8",
      "x": 6600,
      "y": 2600
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6900
    },
    {
      "id": "v10",
      "x": 4000,
      "y": 6900
    },
    {
      "id": "v11",
      "x": 6600,
      "y": 6900
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v7",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v3",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v8",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w6",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
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
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w8",
        "w10",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w10",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w4",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w9",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 2550,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 3550,
      "y": 2550,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 5300,
      "y": 1300,
      "width": 1500,
      "depth": 1900,
      "rotation": 90
    }
  ]
};

export const PLAN_CN_1B1L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-04",
    "name": "方正一室一厅 48m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "开间与进深均衡，家具布置余量较好。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 6800,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 5200
    },
    {
      "id": "v5",
      "x": 2600,
      "y": 5200
    },
    {
      "id": "v6",
      "x": 6800,
      "y": 5200
    },
    {
      "id": "v7",
      "x": 0,
      "y": 2700
    },
    {
      "id": "v8",
      "x": 2600,
      "y": 2700
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7000
    },
    {
      "id": "v10",
      "x": 2600,
      "y": 7000
    },
    {
      "id": "v11",
      "x": 6800,
      "y": 7000
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v8",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v1",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w7",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w8",
        "w9",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w5",
        "w8",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w10",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w10",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 3800,
      "y": 2600,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 6350,
      "y": 2600,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 1300,
      "y": 1350,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    }
  ]
};

export const PLAN_CN_1B1L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-05",
    "name": "带家政区一室一厅 51m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "入口侧设置可兼家政与储物的过渡区域。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 4300,
      "y": 0
    },
    {
      "id": "v3",
      "x": 7100,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 5400
    },
    {
      "id": "v5",
      "x": 4300,
      "y": 5400
    },
    {
      "id": "v6",
      "x": 7100,
      "y": 5400
    },
    {
      "id": "v7",
      "x": 4300,
      "y": 2800
    },
    {
      "id": "v8",
      "x": 7100,
      "y": 2800
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7200
    },
    {
      "id": "v10",
      "x": 4300,
      "y": 7200
    },
    {
      "id": "v11",
      "x": 7100,
      "y": 7200
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v2",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v7",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v3",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v8",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w6",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
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
      "id": "win1",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w8",
        "w10",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w10",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w4",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w9",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 2700,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 3850,
      "y": 2700,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 5700,
      "y": 1400,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f4",
      "definitionId": "wardrobe-large",
      "x": 6700,
      "y": 2400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_1B1L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-1b1l-06",
    "name": "舒适一室一厅 54m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "面向改善型单身或两人家庭的宽厅一居。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 7300,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 5600
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 5600
    },
    {
      "id": "v6",
      "x": 7300,
      "y": 5600
    },
    {
      "id": "v7",
      "x": 0,
      "y": 2900
    },
    {
      "id": "v8",
      "x": 2800,
      "y": 2900
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7400
    },
    {
      "id": "v10",
      "x": 2800,
      "y": 7400
    },
    {
      "id": "v11",
      "x": 7300,
      "y": 7400
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v9",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v2",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w9",
      "from": "v8",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w10",
      "from": "v5",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w11",
      "from": "v3",
      "to": "v6",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v6",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v1",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w7",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w8",
        "w9",
        "w11"
      ]
    },
    {
      "id": "r2",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w5",
        "w8",
        "w13"
      ]
    },
    {
      "id": "r3",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w5",
        "w9",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w10",
        "w12"
      ]
    },
    {
      "id": "r5",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w10",
        "w15"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "sofa-2seat",
      "x": 4000,
      "y": 2800,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "tv-bench",
      "x": 6850,
      "y": 2800,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 1450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 2500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B1L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-01",
    "name": "经济型两室一厅 55m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "保障房与首置家庭常见的两卧客餐合一原型。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 7500,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 2800
    },
    {
      "id": "v5",
      "x": 2600,
      "y": 2800
    },
    {
      "id": "v6",
      "x": 5200,
      "y": 2800
    },
    {
      "id": "v7",
      "x": 7500,
      "y": 2800
    },
    {
      "id": "v8",
      "x": 0,
      "y": 5300
    },
    {
      "id": "v9",
      "x": 2600,
      "y": 5300
    },
    {
      "id": "v10",
      "x": 5200,
      "y": 5300
    },
    {
      "id": "v11",
      "x": 7500,
      "y": 5300
    },
    {
      "id": "v12",
      "x": 0,
      "y": 7300
    },
    {
      "id": "v13",
      "x": 2600,
      "y": 7300
    },
    {
      "id": "v14",
      "x": 5200,
      "y": 7300
    },
    {
      "id": "v15",
      "x": 7500,
      "y": 7300
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1300,
      "y": 1400,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2200,
      "y": 2400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 3800,
      "y": 1400,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 7050,
      "y": 1400,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1300,
      "y": 4050,
      "width": 1500,
      "depth": 1800,
      "rotation": 90
    }
  ]
};

export const PLAN_CN_2B1L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-02",
    "name": "老城更新两室一厅 59m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "适合老旧住宅更新的紧凑三开间组织。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5200,
      "y": 0
    },
    {
      "id": "v3",
      "x": 7900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 2900
    },
    {
      "id": "v5",
      "x": 2400,
      "y": 2900
    },
    {
      "id": "v6",
      "x": 5200,
      "y": 2900
    },
    {
      "id": "v7",
      "x": 7900,
      "y": 2900
    },
    {
      "id": "v8",
      "x": 0,
      "y": 5500
    },
    {
      "id": "v9",
      "x": 2400,
      "y": 5500
    },
    {
      "id": "v10",
      "x": 5200,
      "y": 5500
    },
    {
      "id": "v11",
      "x": 7900,
      "y": 5500
    },
    {
      "id": "v12",
      "x": 0,
      "y": 7500
    },
    {
      "id": "v13",
      "x": 2400,
      "y": 7500
    },
    {
      "id": "v14",
      "x": 5200,
      "y": 7500
    },
    {
      "id": "v15",
      "x": 7900,
      "y": 7500
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 6550,
      "y": 1450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 7500,
      "y": 2500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1450,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 4750,
      "y": 1450,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 6550,
      "y": 4200,
      "width": 1500,
      "depth": 1900,
      "rotation": 90
    }
  ]
};

export const PLAN_CN_2B1L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-03",
    "name": "紧凑两室一厅 62m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "压缩走道后形成完整双卧与独立厨房。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8100,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3000
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 3000
    },
    {
      "id": "v6",
      "x": 5700,
      "y": 3000
    },
    {
      "id": "v7",
      "x": 8100,
      "y": 3000
    },
    {
      "id": "v8",
      "x": 0,
      "y": 5600
    },
    {
      "id": "v9",
      "x": 2800,
      "y": 5600
    },
    {
      "id": "v10",
      "x": 5700,
      "y": 5600
    },
    {
      "id": "v11",
      "x": 8100,
      "y": 5600
    },
    {
      "id": "v12",
      "x": 0,
      "y": 7600
    },
    {
      "id": "v13",
      "x": 2800,
      "y": 7600
    },
    {
      "id": "v14",
      "x": 5700,
      "y": 7600
    },
    {
      "id": "v15",
      "x": 8100,
      "y": 7600
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 1500,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 2600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4000,
      "y": 1500,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 7650,
      "y": 1500,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 4300,
      "width": 1500,
      "depth": 1900,
      "rotation": 90
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 5200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B1L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-04",
    "name": "南北两室一厅 66m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "双卧分居采光面两侧，利于家庭作息分离。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5500,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8400,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3100
    },
    {
      "id": "v5",
      "x": 2500,
      "y": 3100
    },
    {
      "id": "v6",
      "x": 5500,
      "y": 3100
    },
    {
      "id": "v7",
      "x": 8400,
      "y": 3100
    },
    {
      "id": "v8",
      "x": 0,
      "y": 5800
    },
    {
      "id": "v9",
      "x": 2500,
      "y": 5800
    },
    {
      "id": "v10",
      "x": 5500,
      "y": 5800
    },
    {
      "id": "v11",
      "x": 8400,
      "y": 5800
    },
    {
      "id": "v12",
      "x": 0,
      "y": 7800
    },
    {
      "id": "v13",
      "x": 2500,
      "y": 7800
    },
    {
      "id": "v14",
      "x": 5500,
      "y": 7800
    },
    {
      "id": "v15",
      "x": 8400,
      "y": 7800
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 6950,
      "y": 1550,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 8000,
      "y": 2700,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1550,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5050,
      "y": 1550,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 6950,
      "y": 4450,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 8000,
      "y": 5400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B1L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-05",
    "name": "双卧分离两室一厅 69m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "两间卧室保持距离，兼顾父母与儿童居住。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3200
    },
    {
      "id": "v5",
      "x": 3000,
      "y": 3200
    },
    {
      "id": "v6",
      "x": 6100,
      "y": 3200
    },
    {
      "id": "v7",
      "x": 8600,
      "y": 3200
    },
    {
      "id": "v8",
      "x": 0,
      "y": 5900
    },
    {
      "id": "v9",
      "x": 3000,
      "y": 5900
    },
    {
      "id": "v10",
      "x": 6100,
      "y": 5900
    },
    {
      "id": "v11",
      "x": 8600,
      "y": 5900
    },
    {
      "id": "v12",
      "x": 0,
      "y": 8000
    },
    {
      "id": "v13",
      "x": 3000,
      "y": 8000
    },
    {
      "id": "v14",
      "x": 6100,
      "y": 8000
    },
    {
      "id": "v15",
      "x": 8600,
      "y": 8000
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 2800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1600,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8150,
      "y": 1600,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 4550,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 5500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B1L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b1l-06",
    "name": "舒适两室一厅 73m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "尺度更宽松的两室一厅，附家政储物空间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3300
    },
    {
      "id": "v5",
      "x": 2600,
      "y": 3300
    },
    {
      "id": "v6",
      "x": 5800,
      "y": 3300
    },
    {
      "id": "v7",
      "x": 8900,
      "y": 3300
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6100
    },
    {
      "id": "v9",
      "x": 2600,
      "y": 6100
    },
    {
      "id": "v10",
      "x": 5800,
      "y": 6100
    },
    {
      "id": "v11",
      "x": 8900,
      "y": 6100
    },
    {
      "id": "v12",
      "x": 0,
      "y": 8200
    },
    {
      "id": "v13",
      "x": 2600,
      "y": 8200
    },
    {
      "id": "v14",
      "x": 5800,
      "y": 8200
    },
    {
      "id": "v15",
      "x": 8900,
      "y": 8200
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "storage",
      "name": "家政储物",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 7350,
      "y": 1650,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 8500,
      "y": 2900,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1650,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5350,
      "y": 1650,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 7350,
      "y": 4700,
      "width": 1500,
      "depth": 2000,
      "rotation": 90
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 8500,
      "y": 5700,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-01",
    "name": "紧凑两室两厅 69m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "首改常见原型，客厅与餐厅相邻但功能独立。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8200,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3200
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 3200
    },
    {
      "id": "v6",
      "x": 5800,
      "y": 3200
    },
    {
      "id": "v7",
      "x": 8200,
      "y": 3200
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6200
    },
    {
      "id": "v9",
      "x": 2800,
      "y": 6200
    },
    {
      "id": "v10",
      "x": 5800,
      "y": 6200
    },
    {
      "id": "v11",
      "x": 8200,
      "y": 6200
    },
    {
      "id": "v12",
      "x": 0,
      "y": 8400
    },
    {
      "id": "v13",
      "x": 5800,
      "y": 8400
    },
    {
      "id": "v14",
      "x": 8200,
      "y": 8400
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v11",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v10",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w19"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w17",
        "w19"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w6",
        "w7",
        "w9",
        "w13",
        "w20"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w8",
        "w10",
        "w18",
        "w20"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 1600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 2800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4000,
      "y": 1600,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 7750,
      "y": 1600,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 4700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 5800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-02",
    "name": "横厅两室两厅 74m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "客餐空间横向展开，形成较宽公共界面。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 5700,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3300
    },
    {
      "id": "v5",
      "x": 2500,
      "y": 3300
    },
    {
      "id": "v6",
      "x": 5700,
      "y": 3300
    },
    {
      "id": "v7",
      "x": 8600,
      "y": 3300
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6400
    },
    {
      "id": "v9",
      "x": 2500,
      "y": 6400
    },
    {
      "id": "v10",
      "x": 5700,
      "y": 6400
    },
    {
      "id": "v11",
      "x": 8600,
      "y": 6400
    },
    {
      "id": "v12",
      "x": 0,
      "y": 8600
    },
    {
      "id": "v13",
      "x": 2500,
      "y": 8600
    },
    {
      "id": "v14",
      "x": 8600,
      "y": 8600
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v11",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w13"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w12",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w19"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w17",
        "w19"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w7",
        "w8",
        "w10",
        "w15",
        "w20"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w18",
        "w20"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 7150,
      "y": 1650,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 8200,
      "y": 2900,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1650,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5250,
      "y": 1650,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 7150,
      "y": 4850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 8200,
      "y": 6000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-03",
    "name": "南北通透两室两厅 78m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "主要房间分列两侧，公共区贯通组织。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3400
    },
    {
      "id": "v5",
      "x": 3000,
      "y": 3400
    },
    {
      "id": "v6",
      "x": 6300,
      "y": 3400
    },
    {
      "id": "v7",
      "x": 8900,
      "y": 3400
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6600
    },
    {
      "id": "v9",
      "x": 3000,
      "y": 6600
    },
    {
      "id": "v10",
      "x": 6300,
      "y": 6600
    },
    {
      "id": "v11",
      "x": 8900,
      "y": 6600
    },
    {
      "id": "v12",
      "x": 0,
      "y": 8800
    },
    {
      "id": "v13",
      "x": 6300,
      "y": 8800
    },
    {
      "id": "v14",
      "x": 8900,
      "y": 8800
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v11",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v10",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w19"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w17",
        "w19"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w6",
        "w7",
        "w9",
        "w13",
        "w20"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w8",
        "w10",
        "w18",
        "w20"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1700,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8450,
      "y": 1700,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5000,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 6200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-04",
    "name": "边户两室两厅 82m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "增加侧向采光条件的边户型原型。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 6000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9100,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3500
    },
    {
      "id": "v5",
      "x": 2600,
      "y": 3500
    },
    {
      "id": "v6",
      "x": 6000,
      "y": 3500
    },
    {
      "id": "v7",
      "x": 9100,
      "y": 3500
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6700
    },
    {
      "id": "v9",
      "x": 2600,
      "y": 6700
    },
    {
      "id": "v10",
      "x": 6000,
      "y": 6700
    },
    {
      "id": "v11",
      "x": 9100,
      "y": 6700
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9000
    },
    {
      "id": "v13",
      "x": 2600,
      "y": 9000
    },
    {
      "id": "v14",
      "x": 9100,
      "y": 9000
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v11",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w13"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w12",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w19"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w17",
        "w19"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w7",
        "w8",
        "w10",
        "w15",
        "w20"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w18",
        "w20"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 7550,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 8700,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1750,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5550,
      "y": 1750,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 7550,
      "y": 5100,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 8700,
      "y": 6300,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-05",
    "name": "双卫两室两厅 86m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "以双卫生间提升两代同住的使用效率。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3200,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9400,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3600
    },
    {
      "id": "v5",
      "x": 3200,
      "y": 3600
    },
    {
      "id": "v6",
      "x": 6700,
      "y": 3600
    },
    {
      "id": "v7",
      "x": 9400,
      "y": 3600
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6900
    },
    {
      "id": "v9",
      "x": 3200,
      "y": 6900
    },
    {
      "id": "v10",
      "x": 6700,
      "y": 6900
    },
    {
      "id": "v11",
      "x": 9400,
      "y": 6900
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9200
    },
    {
      "id": "v13",
      "x": 6700,
      "y": 9200
    },
    {
      "id": "v14",
      "x": 9400,
      "y": 9200
    },
    {
      "id": "v15",
      "x": 6700,
      "y": 8050
    },
    {
      "id": "v16",
      "x": 9400,
      "y": 8050
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v15",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v16",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v15",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w15",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w15",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w16",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w6",
        "w7",
        "w9",
        "w14",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22"
      ]
    },
    {
      "id": "r8",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w11",
        "w20",
        "w23"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4400,
      "y": 1800,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8950,
      "y": 1800,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 5250,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 6500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_2B2L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-2b2l-06",
    "name": "改善型两室两厅 91m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "较大客餐厅与完整玄关构成舒适两居。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 6400,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9700,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3700
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 3700
    },
    {
      "id": "v6",
      "x": 6400,
      "y": 3700
    },
    {
      "id": "v7",
      "x": 9700,
      "y": 3700
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7100
    },
    {
      "id": "v9",
      "x": 2800,
      "y": 7100
    },
    {
      "id": "v10",
      "x": 6400,
      "y": 7100
    },
    {
      "id": "v11",
      "x": 9700,
      "y": 7100
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9400
    },
    {
      "id": "v13",
      "x": 2800,
      "y": 9400
    },
    {
      "id": "v14",
      "x": 9700,
      "y": 9400
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v11",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w10",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w13",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w13"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w16"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w12",
        "w14"
      ]
    },
    {
      "id": "r4",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w12",
        "w19"
      ]
    },
    {
      "id": "r5",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w17",
        "w19"
      ]
    },
    {
      "id": "r6",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w7",
        "w8",
        "w10",
        "w15",
        "w20"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w18",
        "w20"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 8050,
      "y": 1850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 9300,
      "y": 3300,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1850,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5950,
      "y": 1850,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 8050,
      "y": 5400,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 9300,
      "y": 6700,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-01",
    "name": "紧凑三室一厅 82m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "以较小总面积容纳三卧，适合首置多孩家庭。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3500
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 3500
    },
    {
      "id": "v6",
      "x": 5900,
      "y": 3500
    },
    {
      "id": "v7",
      "x": 8600,
      "y": 3500
    },
    {
      "id": "v8",
      "x": 0,
      "y": 6800
    },
    {
      "id": "v9",
      "x": 2800,
      "y": 6800
    },
    {
      "id": "v10",
      "x": 5900,
      "y": 6800
    },
    {
      "id": "v11",
      "x": 8600,
      "y": 6800
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9500
    },
    {
      "id": "v13",
      "x": 2800,
      "y": 9500
    },
    {
      "id": "v14",
      "x": 5900,
      "y": 9500
    },
    {
      "id": "v15",
      "x": 8600,
      "y": 9500
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4000,
      "y": 1750,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8150,
      "y": 1750,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 5150,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 6400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 7250,
      "y": 5150,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 8200,
      "y": 6400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-02",
    "name": "经济三室一厅 86m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "卧室尺度均衡、公共厅紧凑的经济型方案。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 6000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3600
    },
    {
      "id": "v5",
      "x": 2800,
      "y": 3600
    },
    {
      "id": "v6",
      "x": 6000,
      "y": 3600
    },
    {
      "id": "v7",
      "x": 8900,
      "y": 3600
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7000
    },
    {
      "id": "v9",
      "x": 2800,
      "y": 7000
    },
    {
      "id": "v10",
      "x": 6000,
      "y": 7000
    },
    {
      "id": "v11",
      "x": 8900,
      "y": 7000
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9700
    },
    {
      "id": "v13",
      "x": 2800,
      "y": 9700
    },
    {
      "id": "v14",
      "x": 6000,
      "y": 9700
    },
    {
      "id": "v15",
      "x": 8900,
      "y": 9700
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w10",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 7450,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 8500,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1800,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5550,
      "y": 1800,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 7450,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 8500,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-03",
    "name": "刚需三室一厅 91m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "常见刚需三房，客餐区复合使用。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9200,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3700
    },
    {
      "id": "v5",
      "x": 3000,
      "y": 3700
    },
    {
      "id": "v6",
      "x": 6300,
      "y": 3700
    },
    {
      "id": "v7",
      "x": 9200,
      "y": 3700
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7200
    },
    {
      "id": "v9",
      "x": 3000,
      "y": 7200
    },
    {
      "id": "v10",
      "x": 6300,
      "y": 7200
    },
    {
      "id": "v11",
      "x": 9200,
      "y": 7200
    },
    {
      "id": "v12",
      "x": 0,
      "y": 9900
    },
    {
      "id": "v13",
      "x": 3000,
      "y": 9900
    },
    {
      "id": "v14",
      "x": 6300,
      "y": 9900
    },
    {
      "id": "v15",
      "x": 9200,
      "y": 9900
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3300,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1850,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8750,
      "y": 1850,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 6800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 7750,
      "y": 5450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 8800,
      "y": 6800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-04",
    "name": "双面采光三室一厅 96m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "端部房间获得双面外墙，适合边户条件。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 6400,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9500,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3800
    },
    {
      "id": "v5",
      "x": 3000,
      "y": 3800
    },
    {
      "id": "v6",
      "x": 6400,
      "y": 3800
    },
    {
      "id": "v7",
      "x": 9500,
      "y": 3800
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7400
    },
    {
      "id": "v9",
      "x": 3000,
      "y": 7400
    },
    {
      "id": "v10",
      "x": 6400,
      "y": 7400
    },
    {
      "id": "v11",
      "x": 9500,
      "y": 7400
    },
    {
      "id": "v12",
      "x": 0,
      "y": 10100
    },
    {
      "id": "v13",
      "x": 3000,
      "y": 10100
    },
    {
      "id": "v14",
      "x": 6400,
      "y": 10100
    },
    {
      "id": "v15",
      "x": 9500,
      "y": 10100
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w10",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 7950,
      "y": 1900,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 9100,
      "y": 3400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 1900,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 5950,
      "y": 1900,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 7950,
      "y": 5600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 9100,
      "y": 7000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 7000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-05",
    "name": "三代同堂三室一厅 101m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "三卧分散布置，支持三代人的不同作息。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3200,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9800,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 3900
    },
    {
      "id": "v5",
      "x": 3200,
      "y": 3900
    },
    {
      "id": "v6",
      "x": 6700,
      "y": 3900
    },
    {
      "id": "v7",
      "x": 9800,
      "y": 3900
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7600
    },
    {
      "id": "v9",
      "x": 3200,
      "y": 7600
    },
    {
      "id": "v10",
      "x": 6700,
      "y": 7600
    },
    {
      "id": "v11",
      "x": 9800,
      "y": 7600
    },
    {
      "id": "v12",
      "x": 0,
      "y": 10300
    },
    {
      "id": "v13",
      "x": 3200,
      "y": 10300
    },
    {
      "id": "v14",
      "x": 6700,
      "y": 10300
    },
    {
      "id": "v15",
      "x": 9800,
      "y": 10300
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w12",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w13",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v2",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w11",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w12",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w8",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w2",
        "w4",
        "w5",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w15",
        "w16",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 1950,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 3500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4400,
      "y": 1950,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9350,
      "y": 1950,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 8250,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 9400,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B1L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b1l-06",
    "name": "舒适三室一厅 106m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "加宽公共空间并保留完整储物界面。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 6800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 10100,
      "y": 0
    },
    {
      "id": "v4",
      "x": 0,
      "y": 4000
    },
    {
      "id": "v5",
      "x": 3200,
      "y": 4000
    },
    {
      "id": "v6",
      "x": 6800,
      "y": 4000
    },
    {
      "id": "v7",
      "x": 10100,
      "y": 4000
    },
    {
      "id": "v8",
      "x": 0,
      "y": 7800
    },
    {
      "id": "v9",
      "x": 3200,
      "y": 7800
    },
    {
      "id": "v10",
      "x": 6800,
      "y": 7800
    },
    {
      "id": "v11",
      "x": 10100,
      "y": 7800
    },
    {
      "id": "v12",
      "x": 0,
      "y": 10500
    },
    {
      "id": "v13",
      "x": 3200,
      "y": 10500
    },
    {
      "id": "v14",
      "x": 6800,
      "y": 10500
    },
    {
      "id": "v15",
      "x": 10100,
      "y": 10500
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
      "from": "v4",
      "to": "v5",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w4",
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v12",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
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
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w14",
      "from": "v3",
      "to": "v7",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v1",
      "to": "v4",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v5",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v9",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w9",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w3",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w21",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w1",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w10",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w11",
        "w14"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅与餐区",
      "boundaryWallIds": [
        "w1",
        "w3",
        "w4",
        "w11",
        "w17"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w5",
        "w7",
        "w12",
        "w15"
      ]
    },
    {
      "id": "r4",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w4",
        "w9",
        "w12",
        "w13",
        "w20",
        "w21"
      ]
    },
    {
      "id": "r5",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w18",
        "w20"
      ]
    },
    {
      "id": "r6",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w13",
        "w16"
      ]
    },
    {
      "id": "r7",
      "type": "bathroom",
      "name": "卫生间",
      "boundaryWallIds": [
        "w6",
        "w8",
        "w19",
        "w21"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 8450,
      "y": 2000,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 9700,
      "y": 3600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 1200,
      "y": 2000,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 6350,
      "y": 2000,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 8450,
      "y": 5900,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 9700,
      "y": 7400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 5900,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 7400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-01",
    "name": "紧凑三室两厅双卫 102m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "百平方米级刚改三房，双卫与独立餐厅齐全。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2700,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8300,
      "y": 0
    },
    {
      "id": "v4",
      "x": 10800,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3000
    },
    {
      "id": "v6",
      "x": 2700,
      "y": 3000
    },
    {
      "id": "v7",
      "x": 8300,
      "y": 3000
    },
    {
      "id": "v8",
      "x": 10800,
      "y": 3000
    },
    {
      "id": "v9",
      "x": 0,
      "y": 5800
    },
    {
      "id": "v10",
      "x": 2700,
      "y": 5800
    },
    {
      "id": "v11",
      "x": 8300,
      "y": 5800
    },
    {
      "id": "v12",
      "x": 10800,
      "y": 5800
    },
    {
      "id": "v13",
      "x": 0,
      "y": 9400
    },
    {
      "id": "v14",
      "x": 2700,
      "y": 9400
    },
    {
      "id": "v15",
      "x": 8300,
      "y": 9400
    },
    {
      "id": "v16",
      "x": 10800,
      "y": 9400
    },
    {
      "id": "v17",
      "x": 8300,
      "y": 7600
    },
    {
      "id": "v18",
      "x": 10800,
      "y": 7600
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1350,
      "y": 1500,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2300,
      "y": 2600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 3900,
      "y": 1500,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 7850,
      "y": 1500,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 9550,
      "y": 1500,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 10400,
      "y": 2600,
      "width": 1700,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1350,
      "y": 4400,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2300,
      "y": 5400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-02",
    "name": "南北通透三室两厅 110m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "公共区贯通南北两侧，形成对流通风路径。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8400,
      "y": 0
    },
    {
      "id": "v4",
      "x": 11200,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3100
    },
    {
      "id": "v6",
      "x": 2600,
      "y": 3100
    },
    {
      "id": "v7",
      "x": 8400,
      "y": 3100
    },
    {
      "id": "v8",
      "x": 11200,
      "y": 3100
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6000
    },
    {
      "id": "v10",
      "x": 2600,
      "y": 6000
    },
    {
      "id": "v11",
      "x": 8400,
      "y": 6000
    },
    {
      "id": "v12",
      "x": 11200,
      "y": 6000
    },
    {
      "id": "v13",
      "x": 0,
      "y": 9800
    },
    {
      "id": "v14",
      "x": 2600,
      "y": 9800
    },
    {
      "id": "v15",
      "x": 8400,
      "y": 9800
    },
    {
      "id": "v16",
      "x": 11200,
      "y": 9800
    },
    {
      "id": "v17",
      "x": 0,
      "y": 7900
    },
    {
      "id": "v18",
      "x": 2600,
      "y": 7900
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 9800,
      "y": 1550,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 10800,
      "y": 2700,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 3800,
      "y": 1550,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 7950,
      "y": 1550,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1300,
      "y": 1550,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2200,
      "y": 2700,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 9800,
      "y": 4550,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 10800,
      "y": 5600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-03",
    "name": "横厅三室两厅 118m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "宽面客厅与餐厅连成家庭核心空间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2900,
      "y": 0
    },
    {
      "id": "v3",
      "x": 8900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 11600,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3200
    },
    {
      "id": "v6",
      "x": 2900,
      "y": 3200
    },
    {
      "id": "v7",
      "x": 8900,
      "y": 3200
    },
    {
      "id": "v8",
      "x": 11600,
      "y": 3200
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6200
    },
    {
      "id": "v10",
      "x": 2900,
      "y": 6200
    },
    {
      "id": "v11",
      "x": 8900,
      "y": 6200
    },
    {
      "id": "v12",
      "x": 11600,
      "y": 6200
    },
    {
      "id": "v13",
      "x": 0,
      "y": 10200
    },
    {
      "id": "v14",
      "x": 2900,
      "y": 10200
    },
    {
      "id": "v15",
      "x": 8900,
      "y": 10200
    },
    {
      "id": "v16",
      "x": 11600,
      "y": 10200
    },
    {
      "id": "v17",
      "x": 8900,
      "y": 8200
    },
    {
      "id": "v18",
      "x": 11600,
      "y": 8200
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1450,
      "y": 1600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2500,
      "y": 2800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4100,
      "y": 1600,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8450,
      "y": 1600,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 10250,
      "y": 1600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 11200,
      "y": 2800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1450,
      "y": 4700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2500,
      "y": 5800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-04",
    "name": "景观阳台三室两厅 127m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "景观阳台之外预留生活阳台功能位置。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2800,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9000,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3300
    },
    {
      "id": "v6",
      "x": 2800,
      "y": 3300
    },
    {
      "id": "v7",
      "x": 9000,
      "y": 3300
    },
    {
      "id": "v8",
      "x": 12000,
      "y": 3300
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6400
    },
    {
      "id": "v10",
      "x": 2800,
      "y": 6400
    },
    {
      "id": "v11",
      "x": 9000,
      "y": 6400
    },
    {
      "id": "v12",
      "x": 12000,
      "y": 6400
    },
    {
      "id": "v13",
      "x": 0,
      "y": 10600
    },
    {
      "id": "v14",
      "x": 2800,
      "y": 10600
    },
    {
      "id": "v15",
      "x": 9000,
      "y": 10600
    },
    {
      "id": "v16",
      "x": 12000,
      "y": 10600
    },
    {
      "id": "v17",
      "x": 0,
      "y": 8500
    },
    {
      "id": "v18",
      "x": 2800,
      "y": 8500
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 10500,
      "y": 1650,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 11600,
      "y": 2900,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4000,
      "y": 1650,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8550,
      "y": 1650,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1400,
      "y": 1650,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2400,
      "y": 2900,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 10500,
      "y": 4850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 11600,
      "y": 6000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-05",
    "name": "边户三室两厅 136m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "侧向外墙增加卧室与公共区采光机会。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3100,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9500,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12400,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3400
    },
    {
      "id": "v6",
      "x": 3100,
      "y": 3400
    },
    {
      "id": "v7",
      "x": 9500,
      "y": 3400
    },
    {
      "id": "v8",
      "x": 12400,
      "y": 3400
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6600
    },
    {
      "id": "v10",
      "x": 3100,
      "y": 6600
    },
    {
      "id": "v11",
      "x": 9500,
      "y": 6600
    },
    {
      "id": "v12",
      "x": 12400,
      "y": 6600
    },
    {
      "id": "v13",
      "x": 0,
      "y": 11000
    },
    {
      "id": "v14",
      "x": 3100,
      "y": 11000
    },
    {
      "id": "v15",
      "x": 9500,
      "y": 11000
    },
    {
      "id": "v16",
      "x": 12400,
      "y": 11000
    },
    {
      "id": "v17",
      "x": 9500,
      "y": 8800
    },
    {
      "id": "v18",
      "x": 12400,
      "y": 8800
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1550,
      "y": 1700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2700,
      "y": 3000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4300,
      "y": 1700,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9050,
      "y": 1700,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 10950,
      "y": 1700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 12000,
      "y": 3000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1550,
      "y": 5000,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2700,
      "y": 6200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_3B2L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-3b2l-06",
    "name": "改善三室两厅 146m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "放大主卧、客餐厅和服务空间的改善型三房。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12800,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3500
    },
    {
      "id": "v6",
      "x": 3000,
      "y": 3500
    },
    {
      "id": "v7",
      "x": 9600,
      "y": 3500
    },
    {
      "id": "v8",
      "x": 12800,
      "y": 3500
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6800
    },
    {
      "id": "v10",
      "x": 3000,
      "y": 6800
    },
    {
      "id": "v11",
      "x": 9600,
      "y": 6800
    },
    {
      "id": "v12",
      "x": 12800,
      "y": 6800
    },
    {
      "id": "v13",
      "x": 0,
      "y": 11400
    },
    {
      "id": "v14",
      "x": 3000,
      "y": 11400
    },
    {
      "id": "v15",
      "x": 9600,
      "y": 11400
    },
    {
      "id": "v16",
      "x": 12800,
      "y": 11400
    },
    {
      "id": "v17",
      "x": 0,
      "y": 9100
    },
    {
      "id": "v18",
      "x": 3000,
      "y": 9100
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "balcony",
      "name": "景观阳台",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 11200,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 12400,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1750,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9150,
      "y": 1750,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 11200,
      "y": 5150,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 12400,
      "y": 6400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-01",
    "name": "紧凑四室两厅双卫 130m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "控制总面积的四卧双卫方案，适合多孩家庭。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9200,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3400
    },
    {
      "id": "v6",
      "x": 3000,
      "y": 3400
    },
    {
      "id": "v7",
      "x": 9200,
      "y": 3400
    },
    {
      "id": "v8",
      "x": 12000,
      "y": 3400
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6600
    },
    {
      "id": "v10",
      "x": 3000,
      "y": 6600
    },
    {
      "id": "v11",
      "x": 9200,
      "y": 6600
    },
    {
      "id": "v12",
      "x": 12000,
      "y": 6600
    },
    {
      "id": "v13",
      "x": 0,
      "y": 10800
    },
    {
      "id": "v14",
      "x": 3000,
      "y": 10800
    },
    {
      "id": "v15",
      "x": 9200,
      "y": 10800
    },
    {
      "id": "v16",
      "x": 12000,
      "y": 10800
    },
    {
      "id": "v17",
      "x": 9200,
      "y": 8700
    },
    {
      "id": "v18",
      "x": 12000,
      "y": 8700
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1700,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8750,
      "y": 1700,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 10600,
      "y": 1700,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 11600,
      "y": 3000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5000,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 6200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 10600,
      "y": 5000,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 11600,
      "y": 6200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-02",
    "name": "三代同堂四室两厅 139m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "四间卧室分布在公共区两侧，支持三代同住。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 2900,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9300,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12400,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3500
    },
    {
      "id": "v6",
      "x": 2900,
      "y": 3500
    },
    {
      "id": "v7",
      "x": 9300,
      "y": 3500
    },
    {
      "id": "v8",
      "x": 12400,
      "y": 3500
    },
    {
      "id": "v9",
      "x": 0,
      "y": 6800
    },
    {
      "id": "v10",
      "x": 2900,
      "y": 6800
    },
    {
      "id": "v11",
      "x": 9300,
      "y": 6800
    },
    {
      "id": "v12",
      "x": 12400,
      "y": 6800
    },
    {
      "id": "v13",
      "x": 0,
      "y": 11200
    },
    {
      "id": "v14",
      "x": 2900,
      "y": 11200
    },
    {
      "id": "v15",
      "x": 9300,
      "y": 11200
    },
    {
      "id": "v16",
      "x": 12400,
      "y": 11200
    },
    {
      "id": "v17",
      "x": 0,
      "y": 9000
    },
    {
      "id": "v18",
      "x": 2900,
      "y": 9000
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 10850,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 12000,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4100,
      "y": 1750,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 8850,
      "y": 1750,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1450,
      "y": 1750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2500,
      "y": 3100,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 10850,
      "y": 5150,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 12000,
      "y": 6400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 1450,
      "y": 5150,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 2500,
      "y": 6400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-03",
    "name": "横厅四室两厅 148m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "客厅与餐厅形成连续横向公共空间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3200,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9800,
      "y": 0
    },
    {
      "id": "v4",
      "x": 12800,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3600
    },
    {
      "id": "v6",
      "x": 3200,
      "y": 3600
    },
    {
      "id": "v7",
      "x": 9800,
      "y": 3600
    },
    {
      "id": "v8",
      "x": 12800,
      "y": 3600
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7000
    },
    {
      "id": "v10",
      "x": 3200,
      "y": 7000
    },
    {
      "id": "v11",
      "x": 9800,
      "y": 7000
    },
    {
      "id": "v12",
      "x": 12800,
      "y": 7000
    },
    {
      "id": "v13",
      "x": 0,
      "y": 11600
    },
    {
      "id": "v14",
      "x": 3200,
      "y": 11600
    },
    {
      "id": "v15",
      "x": 9800,
      "y": 11600
    },
    {
      "id": "v16",
      "x": 12800,
      "y": 11600
    },
    {
      "id": "v17",
      "x": 9800,
      "y": 9300
    },
    {
      "id": "v18",
      "x": 12800,
      "y": 9300
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4400,
      "y": 1800,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9350,
      "y": 1800,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 11300,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 12400,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1600,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2800,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 11300,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 12400,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_04: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-04",
    "name": "双卫四室两厅 158m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "可将相邻卫生间分别服务主卧与家庭成员。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3100,
      "y": 0
    },
    {
      "id": "v3",
      "x": 9900,
      "y": 0
    },
    {
      "id": "v4",
      "x": 13200,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3700
    },
    {
      "id": "v6",
      "x": 3100,
      "y": 3700
    },
    {
      "id": "v7",
      "x": 9900,
      "y": 3700
    },
    {
      "id": "v8",
      "x": 13200,
      "y": 3700
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7200
    },
    {
      "id": "v10",
      "x": 3100,
      "y": 7200
    },
    {
      "id": "v11",
      "x": 9900,
      "y": 7200
    },
    {
      "id": "v12",
      "x": 13200,
      "y": 7200
    },
    {
      "id": "v13",
      "x": 0,
      "y": 12000
    },
    {
      "id": "v14",
      "x": 3100,
      "y": 12000
    },
    {
      "id": "v15",
      "x": 9900,
      "y": 12000
    },
    {
      "id": "v16",
      "x": 13200,
      "y": 12000
    },
    {
      "id": "v17",
      "x": 0,
      "y": 9600
    },
    {
      "id": "v18",
      "x": 3100,
      "y": 9600
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 11550,
      "y": 1850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 12800,
      "y": 3300,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4300,
      "y": 1850,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9450,
      "y": 1850,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1550,
      "y": 1850,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2700,
      "y": 3300,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 11550,
      "y": 5450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 12800,
      "y": 6800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 1550,
      "y": 5450,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 2700,
      "y": 6800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_05: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-05",
    "name": "大面宽四室两厅 169m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "四开间朝向主要采光面的大面宽原型。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3400,
      "y": 0
    },
    {
      "id": "v3",
      "x": 10400,
      "y": 0
    },
    {
      "id": "v4",
      "x": 13600,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3800
    },
    {
      "id": "v6",
      "x": 3400,
      "y": 3800
    },
    {
      "id": "v7",
      "x": 10400,
      "y": 3800
    },
    {
      "id": "v8",
      "x": 13600,
      "y": 3800
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7400
    },
    {
      "id": "v10",
      "x": 3400,
      "y": 7400
    },
    {
      "id": "v11",
      "x": 10400,
      "y": 7400
    },
    {
      "id": "v12",
      "x": 13600,
      "y": 7400
    },
    {
      "id": "v13",
      "x": 0,
      "y": 12400
    },
    {
      "id": "v14",
      "x": 3400,
      "y": 12400
    },
    {
      "id": "v15",
      "x": 10400,
      "y": 12400
    },
    {
      "id": "v16",
      "x": 13600,
      "y": 12400
    },
    {
      "id": "v17",
      "x": 10400,
      "y": 9900
    },
    {
      "id": "v18",
      "x": 13600,
      "y": 9900
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v9",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v10",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v11",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v17",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v8",
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
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w17",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w14",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w15",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w7",
        "w10",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w19",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w9",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1700,
      "y": 1900,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 3000,
      "y": 3400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4600,
      "y": 1900,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 9950,
      "y": 1900,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 12000,
      "y": 1900,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 13200,
      "y": 3400,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1700,
      "y": 5600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 3000,
      "y": 7000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 12000,
      "y": 5600,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 13200,
      "y": 7000,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_4B2L_06: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-4b2l-06",
    "name": "改善四室两厅 179m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "公共空间、卧室尺度和收纳均较充裕。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3300,
      "y": 0
    },
    {
      "id": "v3",
      "x": 10500,
      "y": 0
    },
    {
      "id": "v4",
      "x": 14000,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3900
    },
    {
      "id": "v6",
      "x": 3300,
      "y": 3900
    },
    {
      "id": "v7",
      "x": 10500,
      "y": 3900
    },
    {
      "id": "v8",
      "x": 14000,
      "y": 3900
    },
    {
      "id": "v9",
      "x": 0,
      "y": 7600
    },
    {
      "id": "v10",
      "x": 3300,
      "y": 7600
    },
    {
      "id": "v11",
      "x": 10500,
      "y": 7600
    },
    {
      "id": "v12",
      "x": 14000,
      "y": 7600
    },
    {
      "id": "v13",
      "x": 0,
      "y": 12800
    },
    {
      "id": "v14",
      "x": 3300,
      "y": 12800
    },
    {
      "id": "v15",
      "x": 10500,
      "y": 12800
    },
    {
      "id": "v16",
      "x": 14000,
      "y": 12800
    },
    {
      "id": "v17",
      "x": 0,
      "y": 10200
    },
    {
      "id": "v18",
      "x": 3300,
      "y": 10200
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v9",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v13",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v14",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
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
      "from": "v3",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w15",
      "from": "v7",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w16",
      "from": "v11",
      "to": "v15",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v4",
      "to": "v8",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v8",
      "to": "v12",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v12",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v6",
      "to": "v10",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v10",
      "to": "v18",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v18",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v5",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v9",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v17",
      "to": "v13",
      "thickness": 200,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w11",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w14",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w20",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w23",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w24",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w25",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w6",
        "w14",
        "w17"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w14",
        "w20"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w20",
        "w24"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w6",
        "w9",
        "w15",
        "w18"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w8",
        "w15",
        "w21"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w4",
        "w7",
        "w21",
        "w25"
      ]
    },
    {
      "id": "r7",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w9",
        "w12",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r8",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w8",
        "w11",
        "w16",
        "w22",
        "w23"
      ]
    },
    {
      "id": "r9",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w7",
        "w13",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w10",
        "w13",
        "w23",
        "w27"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 12250,
      "y": 1950,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 13600,
      "y": 3500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4500,
      "y": 1950,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 10050,
      "y": 1950,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1650,
      "y": 1950,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2900,
      "y": 3500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 12250,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 13600,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 1650,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 2900,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_5B2L_01: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-5b2l-01",
    "name": "三代同堂五室两厅 173m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "为三代同堂设置五个可独立使用的睡眠或工作房间。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 12400,
      "y": 0
    },
    {
      "id": "v4",
      "x": 15200,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3600
    },
    {
      "id": "v6",
      "x": 3000,
      "y": 3600
    },
    {
      "id": "v7",
      "x": 9400,
      "y": 3600
    },
    {
      "id": "v8",
      "x": 12400,
      "y": 3600
    },
    {
      "id": "v9",
      "x": 15200,
      "y": 3600
    },
    {
      "id": "v10",
      "x": 0,
      "y": 7000
    },
    {
      "id": "v11",
      "x": 3000,
      "y": 7000
    },
    {
      "id": "v12",
      "x": 9400,
      "y": 7000
    },
    {
      "id": "v13",
      "x": 12400,
      "y": 7000
    },
    {
      "id": "v14",
      "x": 15200,
      "y": 7000
    },
    {
      "id": "v15",
      "x": 0,
      "y": 11400
    },
    {
      "id": "v16",
      "x": 3000,
      "y": 11400
    },
    {
      "id": "v17",
      "x": 12400,
      "y": 11400
    },
    {
      "id": "v18",
      "x": 15200,
      "y": 11400
    },
    {
      "id": "v19",
      "x": 12400,
      "y": 9200
    },
    {
      "id": "v20",
      "x": 15200,
      "y": 9200
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v5",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v10",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v13",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v19",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v9",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v14",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v20",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v7",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w13",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w6",
        "w19",
        "w22"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w8",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w9",
        "w20",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w6",
        "w10",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "书房/客卧",
      "boundaryWallIds": [
        "w7",
        "w11",
        "w23",
        "w27"
      ]
    },
    {
      "id": "r8",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w8",
        "w12",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r9",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w13",
        "w21",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w11",
        "w15",
        "w24",
        "w28"
      ]
    },
    {
      "id": "r11",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w14",
        "w15",
        "w25",
        "w29"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1800,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 11950,
      "y": 1800,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 13800,
      "y": 1800,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 14800,
      "y": 3200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 10900,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 12000,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f11",
      "definitionId": "bed-queen",
      "x": 13800,
      "y": 5300,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f12",
      "definitionId": "wardrobe-large",
      "x": 14800,
      "y": 6600,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_5B2L_02: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-5b2l-02",
    "name": "大平层五室两厅 208m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "以大横厅组织五房，适合多人家庭与居家办公。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3000,
      "y": 0
    },
    {
      "id": "v3",
      "x": 13200,
      "y": 0
    },
    {
      "id": "v4",
      "x": 16500,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 3900
    },
    {
      "id": "v6",
      "x": 3000,
      "y": 3900
    },
    {
      "id": "v7",
      "x": 6200,
      "y": 3900
    },
    {
      "id": "v8",
      "x": 13200,
      "y": 3900
    },
    {
      "id": "v9",
      "x": 16500,
      "y": 3900
    },
    {
      "id": "v10",
      "x": 0,
      "y": 7600
    },
    {
      "id": "v11",
      "x": 3000,
      "y": 7600
    },
    {
      "id": "v12",
      "x": 6200,
      "y": 7600
    },
    {
      "id": "v13",
      "x": 13200,
      "y": 7600
    },
    {
      "id": "v14",
      "x": 16500,
      "y": 7600
    },
    {
      "id": "v15",
      "x": 0,
      "y": 12600
    },
    {
      "id": "v16",
      "x": 3000,
      "y": 12600
    },
    {
      "id": "v17",
      "x": 13200,
      "y": 12600
    },
    {
      "id": "v18",
      "x": 16500,
      "y": 12600
    },
    {
      "id": "v19",
      "x": 0,
      "y": 10100
    },
    {
      "id": "v20",
      "x": 3000,
      "y": 10100
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v8",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v13",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v9",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v14",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v6",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v11",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v20",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v5",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v10",
      "to": "v19",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v19",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v7",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w13",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w10",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w16",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w19",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w20",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w21",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w6",
        "w16",
        "w22"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w7",
        "w11",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w6",
        "w10",
        "w17",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w5",
        "w9",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "书房/客卧",
      "boundaryWallIds": [
        "w4",
        "w8",
        "w23",
        "w27"
      ]
    },
    {
      "id": "r8",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w11",
        "w14",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r9",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w13",
        "w18",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w8",
        "w15",
        "w24",
        "w28"
      ]
    },
    {
      "id": "r11",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w12",
        "w15",
        "w25",
        "w29"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 14850,
      "y": 1950,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 16100,
      "y": 3500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4200,
      "y": 1950,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 12750,
      "y": 1950,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 1950,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 3500,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 14850,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 16100,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 4600,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 5800,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f11",
      "definitionId": "bed-queen",
      "x": 1500,
      "y": 5750,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f12",
      "definitionId": "wardrobe-large",
      "x": 2600,
      "y": 7200,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const PLAN_CN_5B2L_03: StandardFloorPlan = {
  "version": 1,
  "unit": "mm",
  "meta": {
    "id": "floor-plan-cn-5b2l-03",
    "name": "改善五室两厅 246m²",
    "source": "template",
    "isStandard": true,
    "createdAt": "2026-09-18T00:00:00.000Z",
    "updatedAt": "2026-09-18T00:00:00.000Z",
    "description": "大尺度五房双厅双卫原型，可继续扩展套房系统。"
  },
  "vertices": [
    {
      "id": "v1",
      "x": 0,
      "y": 0
    },
    {
      "id": "v2",
      "x": 3600,
      "y": 0
    },
    {
      "id": "v3",
      "x": 14600,
      "y": 0
    },
    {
      "id": "v4",
      "x": 17800,
      "y": 0
    },
    {
      "id": "v5",
      "x": 0,
      "y": 4200
    },
    {
      "id": "v6",
      "x": 3600,
      "y": 4200
    },
    {
      "id": "v7",
      "x": 11200,
      "y": 4200
    },
    {
      "id": "v8",
      "x": 14600,
      "y": 4200
    },
    {
      "id": "v9",
      "x": 17800,
      "y": 4200
    },
    {
      "id": "v10",
      "x": 0,
      "y": 8200
    },
    {
      "id": "v11",
      "x": 3600,
      "y": 8200
    },
    {
      "id": "v12",
      "x": 11200,
      "y": 8200
    },
    {
      "id": "v13",
      "x": 14600,
      "y": 8200
    },
    {
      "id": "v14",
      "x": 17800,
      "y": 8200
    },
    {
      "id": "v15",
      "x": 0,
      "y": 13800
    },
    {
      "id": "v16",
      "x": 3600,
      "y": 13800
    },
    {
      "id": "v17",
      "x": 14600,
      "y": 13800
    },
    {
      "id": "v18",
      "x": 17800,
      "y": 13800
    },
    {
      "id": "v19",
      "x": 14600,
      "y": 11000
    },
    {
      "id": "v20",
      "x": 17800,
      "y": 11000
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
      "from": "v5",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w5",
      "from": "v6",
      "to": "v7",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w6",
      "from": "v7",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w7",
      "from": "v8",
      "to": "v9",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w8",
      "from": "v10",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w9",
      "from": "v11",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w10",
      "from": "v12",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w11",
      "from": "v13",
      "to": "v14",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w12",
      "from": "v15",
      "to": "v16",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w13",
      "from": "v16",
      "to": "v17",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w14",
      "from": "v17",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "horizontal"
    },
    {
      "id": "w15",
      "from": "v19",
      "to": "v20",
      "thickness": 120,
      "lockAxis": "horizontal"
    },
    {
      "id": "w16",
      "from": "v1",
      "to": "v5",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w17",
      "from": "v5",
      "to": "v10",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w18",
      "from": "v10",
      "to": "v15",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w19",
      "from": "v2",
      "to": "v6",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w20",
      "from": "v6",
      "to": "v11",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w21",
      "from": "v11",
      "to": "v16",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w22",
      "from": "v3",
      "to": "v8",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w23",
      "from": "v8",
      "to": "v13",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w24",
      "from": "v13",
      "to": "v19",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w25",
      "from": "v19",
      "to": "v17",
      "thickness": 120,
      "lockAxis": "vertical"
    },
    {
      "id": "w26",
      "from": "v4",
      "to": "v9",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w27",
      "from": "v9",
      "to": "v14",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w28",
      "from": "v14",
      "to": "v20",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w29",
      "from": "v20",
      "to": "v18",
      "thickness": 200,
      "lockAxis": "vertical"
    },
    {
      "id": "w30",
      "from": "v7",
      "to": "v12",
      "thickness": 120,
      "lockAxis": "vertical"
    }
  ],
  "openings": [
    {
      "id": "d1",
      "type": "door",
      "wallId": "w13",
      "position": 0.25,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d2",
      "type": "door",
      "wallId": "w9",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d3",
      "type": "door",
      "wallId": "w5",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d4",
      "type": "door",
      "wallId": "w19",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d5",
      "type": "door",
      "wallId": "w4",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d6",
      "type": "door",
      "wallId": "w22",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d7",
      "type": "door",
      "wallId": "w6",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d8",
      "type": "door",
      "wallId": "w7",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d9",
      "type": "door",
      "wallId": "w8",
      "position": 0.5,
      "width": 900,
      "height": 2100
    },
    {
      "id": "d10",
      "type": "door",
      "wallId": "w11",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "d11",
      "type": "door",
      "wallId": "w25",
      "position": 0.5,
      "width": 800,
      "height": 2100
    },
    {
      "id": "win1",
      "type": "window",
      "wallId": "w16",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win2",
      "type": "window",
      "wallId": "w2",
      "position": 0.5,
      "width": 2400,
      "height": 1400
    },
    {
      "id": "win3",
      "type": "window",
      "wallId": "w26",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win4",
      "type": "window",
      "wallId": "w17",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win5",
      "type": "window",
      "wallId": "w27",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    },
    {
      "id": "win6",
      "type": "window",
      "wallId": "w18",
      "position": 0.5,
      "width": 1800,
      "height": 1400
    }
  ],
  "rooms": [
    {
      "id": "r1",
      "type": "bedroom",
      "name": "主卧室",
      "boundaryWallIds": [
        "w1",
        "w4",
        "w16",
        "w19"
      ]
    },
    {
      "id": "r2",
      "type": "living_room",
      "name": "客厅",
      "boundaryWallIds": [
        "w2",
        "w5",
        "w6",
        "w19",
        "w22"
      ]
    },
    {
      "id": "r3",
      "type": "bedroom",
      "name": "次卧室一",
      "boundaryWallIds": [
        "w3",
        "w7",
        "w22",
        "w26"
      ]
    },
    {
      "id": "r4",
      "type": "bedroom",
      "name": "次卧室二",
      "boundaryWallIds": [
        "w4",
        "w8",
        "w17",
        "w20"
      ]
    },
    {
      "id": "r5",
      "type": "dining_room",
      "name": "餐厅",
      "boundaryWallIds": [
        "w5",
        "w9",
        "w20",
        "w30"
      ]
    },
    {
      "id": "r6",
      "type": "bedroom",
      "name": "次卧室三",
      "boundaryWallIds": [
        "w6",
        "w10",
        "w23",
        "w30"
      ]
    },
    {
      "id": "r7",
      "type": "bedroom",
      "name": "书房/客卧",
      "boundaryWallIds": [
        "w7",
        "w11",
        "w23",
        "w27"
      ]
    },
    {
      "id": "r8",
      "type": "kitchen",
      "name": "厨房",
      "boundaryWallIds": [
        "w8",
        "w12",
        "w18",
        "w21"
      ]
    },
    {
      "id": "r9",
      "type": "hallway",
      "name": "玄关与过道",
      "boundaryWallIds": [
        "w9",
        "w10",
        "w13",
        "w21",
        "w24",
        "w25"
      ]
    },
    {
      "id": "r10",
      "type": "bathroom",
      "name": "主卫生间",
      "boundaryWallIds": [
        "w11",
        "w15",
        "w24",
        "w28"
      ]
    },
    {
      "id": "r11",
      "type": "bathroom",
      "name": "客卫生间",
      "boundaryWallIds": [
        "w14",
        "w15",
        "w25",
        "w29"
      ]
    }
  ],
  "furniture": [
    {
      "id": "f1",
      "definitionId": "bed-queen",
      "x": 1800,
      "y": 2100,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f2",
      "definitionId": "wardrobe-large",
      "x": 3200,
      "y": 3800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f3",
      "definitionId": "sofa-2seat",
      "x": 4800,
      "y": 2100,
      "width": 1800,
      "depth": 850,
      "rotation": 0
    },
    {
      "id": "f4",
      "definitionId": "tv-bench",
      "x": 14150,
      "y": 2100,
      "width": 1800,
      "depth": 400,
      "rotation": 180
    },
    {
      "id": "f5",
      "definitionId": "bed-queen",
      "x": 16200,
      "y": 2100,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f6",
      "definitionId": "wardrobe-large",
      "x": 17400,
      "y": 3800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f7",
      "definitionId": "bed-queen",
      "x": 1800,
      "y": 6200,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f8",
      "definitionId": "wardrobe-large",
      "x": 3200,
      "y": 7800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f9",
      "definitionId": "bed-queen",
      "x": 12900,
      "y": 6200,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f10",
      "definitionId": "wardrobe-large",
      "x": 14200,
      "y": 7800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    },
    {
      "id": "f11",
      "definitionId": "bed-queen",
      "x": 16200,
      "y": 6200,
      "width": 1500,
      "depth": 2000,
      "rotation": 0
    },
    {
      "id": "f12",
      "definitionId": "wardrobe-large",
      "x": 17400,
      "y": 7800,
      "width": 1800,
      "depth": 600,
      "rotation": 180
    }
  ]
};

export const FLOOR_PLAN_CATALOG_DATA: readonly StandardFloorPlan[] = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
  PLAN_CN_STUDIO_01,
  PLAN_CN_STUDIO_02,
  PLAN_CN_STUDIO_03,
  PLAN_CN_1B1L_01,
  PLAN_CN_1B1L_02,
  PLAN_CN_1B1L_03,
  PLAN_CN_1B1L_04,
  PLAN_CN_1B1L_05,
  PLAN_CN_1B1L_06,
  PLAN_CN_2B1L_01,
  PLAN_CN_2B1L_02,
  PLAN_CN_2B1L_03,
  PLAN_CN_2B1L_04,
  PLAN_CN_2B1L_05,
  PLAN_CN_2B1L_06,
  PLAN_CN_2B2L_01,
  PLAN_CN_2B2L_02,
  PLAN_CN_2B2L_03,
  PLAN_CN_2B2L_04,
  PLAN_CN_2B2L_05,
  PLAN_CN_2B2L_06,
  PLAN_CN_3B1L_01,
  PLAN_CN_3B1L_02,
  PLAN_CN_3B1L_03,
  PLAN_CN_3B1L_04,
  PLAN_CN_3B1L_05,
  PLAN_CN_3B1L_06,
  PLAN_CN_3B2L_01,
  PLAN_CN_3B2L_02,
  PLAN_CN_3B2L_03,
  PLAN_CN_3B2L_04,
  PLAN_CN_3B2L_05,
  PLAN_CN_3B2L_06,
  PLAN_CN_4B2L_01,
  PLAN_CN_4B2L_02,
  PLAN_CN_4B2L_03,
  PLAN_CN_4B2L_04,
  PLAN_CN_4B2L_05,
  PLAN_CN_4B2L_06,
  PLAN_CN_5B2L_01,
  PLAN_CN_5B2L_02,
  PLAN_CN_5B2L_03,
];
