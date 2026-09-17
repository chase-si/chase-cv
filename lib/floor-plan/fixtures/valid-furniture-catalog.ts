import type { FurnitureCatalog } from "../types";

export const VALID_FURNITURE_CATALOG: FurnitureCatalog = {
  version: 1,
  unit: "mm",
  definitions: [
    {
      id: "bed-double",
      name: "双人床 (1.8m)",
      category: "bed",
      defaultSize: {
        width: 1800,
        depth: 2000,
        height: 900,
      },
      allowedSizeRanges: {
        width: { min: 1500, max: 2000, step: 100 },
        depth: { min: 1900, max: 2200, step: 50 },
      },
      clearanceRules: {
        left: 600,
        right: 600,
        front: 600,
      },
    },
    {
      id: "bed-single",
      name: "单人床 (1.2m)",
      category: "bed",
      defaultSize: {
        width: 1200,
        depth: 2000,
        height: 800,
      },
      allowedSizeRanges: {
        width: { min: 900, max: 1350, step: 50 },
        depth: { min: 1900, max: 2100, step: 50 },
      },
      clearanceRules: {
        left: 500,
        front: 600,
      },
    },
    {
      id: "sofa-3seat",
      name: "三人沙发",
      category: "sofa",
      defaultSize: {
        width: 2100,
        depth: 900,
        height: 850,
      },
      allowedSizeRanges: {
        width: { min: 1800, max: 2600, step: 100 },
        depth: { min: 800, max: 1050, step: 50 },
      },
      clearanceRules: {
        front: 450,
      },
    },
    {
      id: "dining-table-4",
      name: "四人餐桌",
      category: "table",
      defaultSize: {
        width: 1400,
        depth: 800,
        height: 750,
      },
      allowedSizeRanges: {
        width: { min: 1200, max: 1600, step: 100 },
        depth: { min: 700, max: 900, step: 50 },
      },
      clearanceRules: {
        all: 750,
      },
    },
    {
      id: "wardrobe-large",
      name: "大衣柜",
      category: "storage",
      defaultSize: {
        width: 1800,
        depth: 600,
        height: 2200,
      },
      allowedSizeRanges: {
        width: { min: 1200, max: 2400, step: 200 },
        depth: { min: 550, max: 650, step: 50 },
      },
      clearanceRules: {
        front: 800,
      },
    },
    {
      id: "desk",
      name: "书桌",
      category: "desk",
      defaultSize: {
        width: 1200,
        depth: 600,
        height: 750,
      },
      allowedSizeRanges: {
        width: { min: 1000, max: 1600, step: 100 },
        depth: { min: 500, max: 750, step: 50 },
      },
      clearanceRules: {
        front: 750,
      },
    },
  ],
};
