# 中国代表性真实住宅户型数据集

本数据集包含 **50 套**基于公开真实户型图正交简化重建的中国城市住宅户型，作为 `/floor-plan` 目录的唯一标准户型来源。

## 文件

- `../../lib/floor-plan/catalog-data.ts`：运行时目录数据源（由本目录 `standard-floorplans-50.ts` 同步），导出 50 个 `StandardFloorPlan` 与 `FLOOR_PLAN_CATALOG_DATA`。
- `standard-floorplans-50.ts`：原始数据集参考副本。
- `generate-floor-plans.mjs`：历史参数化生成脚本（当前目录已切换为真实来源重建数据）。

## 使用方法

```ts
import { FLOOR_PLAN_CATALOG_DATA } from "@/lib/floor-plan/catalog-data";

const twoBedroomPlans = FLOOR_PLAN_CATALOG_DATA.filter((plan) =>
  (plan.meta.id ?? "").includes("-2br-"),
);
```

## 建模约定

- 坐标与构件尺寸单位均为毫米。
- 外墙厚度一般为 200 mm，内墙为 120 mm。
- `source` 保持为 `"template"`，避免破坏已有类型枚举；真实来源见独立 research-manifest。
- 户型均采用正交墙体；房间 `boundaryWallIds` 按视觉顺时针排列。
- 本批数据不预置家具实例（`furniture: []`），由编辑器工作流按需添加。

## 边界说明

这些对象按公开户型图做正交几何简化重建，用于产品原型与软件测试，不应直接用于报建、结构施工、消防审查或合规结论。真实项目须由有资质的建筑专业人员复核。
