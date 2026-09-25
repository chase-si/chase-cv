import type { FurnitureCatalog } from "../types";

export const VALID_FURNITURE_CATALOG: FurnitureCatalog = {
  version: 2,
  unit: "mm",
  definitions: [
    {
      id: "bed-double",
      name: "双人床 (1.8m)",
      category: "bed",
      specifications: [
        {
          id: "bed-double-1800",
          name: "1800 × 2000 mm",
          width: 1800,
          depth: 2000,
          height: 900,
          clearance: {
            front: { minimum: 600, recommended: 900 },
            back: { minimum: 0, recommended: 0 },
            left: { minimum: 600, recommended: 750 },
            right: { minimum: 600, recommended: 750 },
          },
        },
        {
          id: "bed-double-1500",
          name: "1500 × 2000 mm",
          width: 1500,
          depth: 2000,
          height: 900,
          clearance: {
            front: { minimum: 600, recommended: 900 },
            back: { minimum: 0, recommended: 0 },
            left: { minimum: 600, recommended: 750 },
            right: { minimum: 600, recommended: 750 },
          },
        },
      ],
    },
    {
      id: "bed-single",
      name: "单人床 (1.2m)",
      category: "bed",
      specifications: [
        {
          id: "bed-single-1200",
          name: "1200 × 2000 mm",
          width: 1200,
          depth: 2000,
          height: 800,
          clearance: {
            front: { minimum: 600, recommended: 800 },
            back: { minimum: 0, recommended: 0 },
            left: { minimum: 500, recommended: 700 },
            right: { minimum: 0, recommended: 500 },
          },
        },
      ],
    },
    {
      id: "sofa-3seat",
      name: "三人沙发",
      category: "sofa",
      specifications: [
        {
          id: "sofa-3seat-2100",
          name: "2100 × 900 mm",
          width: 2100,
          depth: 900,
          height: 850,
          clearance: {
            front: { minimum: 450, recommended: 600 },
            back: { minimum: 0, recommended: 100 },
            left: { minimum: 100, recommended: 300 },
            right: { minimum: 100, recommended: 300 },
          },
        },
      ],
    },
    {
      id: "dining-table-4",
      name: "四人餐桌",
      category: "table",
      specifications: [
        {
          id: "dining-table-4-1400",
          name: "1400 × 800 mm",
          width: 1400,
          depth: 800,
          height: 750,
          clearance: {
            front: { minimum: 750, recommended: 900 },
            back: { minimum: 750, recommended: 900 },
            left: { minimum: 600, recommended: 750 },
            right: { minimum: 600, recommended: 750 },
          },
        },
      ],
    },
    {
      id: "wardrobe-large",
      name: "大衣柜",
      category: "storage",
      specifications: [
        {
          id: "wardrobe-large-1800",
          name: "1800 × 600 mm",
          width: 1800,
          depth: 600,
          height: 2200,
          clearance: {
            front: { minimum: 800, recommended: 1000 },
            back: { minimum: 0, recommended: 0 },
            left: { minimum: 0, recommended: 100 },
            right: { minimum: 0, recommended: 100 },
          },
        },
      ],
    },
    {
      id: "desk",
      name: "书桌",
      category: "desk",
      specifications: [
        {
          id: "desk-1200",
          name: "1200 × 600 mm",
          width: 1200,
          depth: 600,
          height: 750,
          clearance: {
            front: { minimum: 750, recommended: 900 },
            back: { minimum: 0, recommended: 100 },
            left: { minimum: 100, recommended: 200 },
            right: { minimum: 100, recommended: 200 },
          },
        },
      ],
    },
  ],
};
