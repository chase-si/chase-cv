# 中国代表性标准户型数据集

本数据集包含 **42 套**标准化重绘的中国城市住宅户型原型，可直接作为户型编辑器模板、自动布局测试数据或推荐系统的初始样本。

## 构成

| 类型 | 数量 | 典型面积区间（约） |
|---|---:|---:|
| 开间 / 1室0厅 | 3 | 27–34 m² |
| 1室1厅 | 6 | 38–54 m² |
| 2室1厅 | 6 | 55–73 m² |
| 2室2厅 | 6 | 69–91 m² |
| 3室1厅 | 6 | 82–106 m² |
| 3室2厅 | 6 | 102–146 m² |
| 4室2厅 | 6 | 130–179 m² |
| 5室2厅 | 3 | 173–246 m² |

> 面积按户型外轮廓坐标计算，用于模板分档，不等同于产权建筑面积、套内使用面积或实测面积。

## 文件

- `china-representative-floor-plans.ts`：42 个显式 `StandardFloorPlan` 对象与总索引 `CHINA_REPRESENTATIVE_FLOOR_PLANS`。
- `floor-plan-summary.json`：每套户型的对象数量摘要，便于快速检查和生成 UI 列表。
- `generate-floor-plans.mjs`：可重复生成数据的脚本；生成后会自动做 ID 与引用完整性检查。

## 使用方法

数据文件遵循题目中的写法，默认 `StandardFloorPlan` 类型已在项目作用域中。若类型通过模块导出，请在文件开头补上你项目中的真实路径，例如：

```ts
import type { StandardFloorPlan } from "@/types/floor-plan";
```

```ts
import { CHINA_REPRESENTATIVE_FLOOR_PLANS } from "./china-representative-floor-plans";

const threeBedroomPlans = CHINA_REPRESENTATIVE_FLOOR_PLANS.filter((plan) =>
  plan.meta.id.startsWith("plan-cn-3b"),
);
```

## 建模约定

- 坐标与构件尺寸单位均为毫米。
- 外墙厚度统一为 200 mm，内墙为 120 mm。
- 户门一般为 900 × 2100 mm；卫生间门一般为 800 × 2100 mm。
- `source` 保持为示例中的 `"template"`，避免破坏已有类型枚举。
- 户型均采用正交墙体；奇数编号与偶数编号交替镜像，用于覆盖左右边户场景。
- 家具只使用题目示例中已经出现的 `definitionId`：`sofa-2seat`、`tv-bench`、`bed-queen`、`wardrobe-large`。
- 房间类型还使用了常见扩展值：`kitchen`、`bathroom`、`dining_room`、`hallway`、`storage`、`balcony`。如果项目里的 `RoomType` 是封闭联合类型，需要添加这些值或建立映射。

## 原型来源与边界

这些对象不是从某个楼盘图纸复制而来，而是综合公开住宅规范、地方设计标准和中国商品住宅/保障性住房中常见的空间组织方式后进行的参数化重绘。这样可降低版权和具体项目误差，也更适合作为通用产品数据。

主要参考：

1. 住房和城乡建设部：《住宅项目规范》GB 55038-2025，自 2025-05-01 起实施。  
   https://xxgk.lczf.gov.cn/gzbm/lczrstj/fdzdgknr/cxghly/ggfw/202511/t20251127_2290880.shtml
2. 上海市住房和城乡建设管理委员会：《住宅设计标准》（包含起居室使用面积和开间等细化要求）。  
   https://jsjtw.sh.gov.cn/
3. 广州市地方标准 DB4401 住宅设计相关条文（基本套型与最小套型面积要求）。  
   https://scjgj.gz.gov.cn/
4. 住房和城乡建设部办公厅：集中式租赁住房建设适用标准政策说明。  
   https://www.scio.gov.cn/

本数据集适合产品原型和软件测试，不应直接用于报建、结构施工、消防审查、采光计算或无障碍合规结论。真实项目还需结合朝向、楼栋核心筒、结构柱网、设备管井、当地日照标准和具体家庭需求由专业人员复核。

## 建议继续补充的类型

若后续用于更完整的中国住宅样本库，建议再增加：

- 2+1 房（可变书房），覆盖弹性隔断场景；
- 3室2厅1卫，与本数据集的双卫改善型形成对照；
- 4室2厅3卫或双套房，覆盖高端改善；
- 复式、跃层与 LOFT，验证跨层数据结构；
- 适老化两居与无障碍一居，验证轮椅回转、宽门与连续通行；
- 带独立家政间、保姆间或中西双厨的大平层。
