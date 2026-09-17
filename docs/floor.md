# 户型编辑器 MVP

**Product Requirements Document**

标准户型选择 · 墙体微调 · 门窗沿墙编辑 · 家具摆放 · 空间规则反馈 · CubiCasa 图片转户型实验

| 项目 | 内容 |
|---|---|
| 文档版本 | v0.2 MVP |
| 状态 | 可用于原型设计 / 技术拆解 / 开发排期 |
| 目标平台 | Web，前端优先；CubiCasa 图片识别实验允许独立本地/推理服务 |
| 日期 | 2026-09-17 |

> **产品原则**：编辑器与 AI 识图解耦。`FloorPlan` 拓扑 JSON 是唯一核心数据协议；CubiCasa 仅作为图片数据导入器，后续可以替换或增加其他识别方案而不影响编辑器核心。

## 目录

1. 产品概述
2. MVP 目标与非目标
3. 用户与核心场景
4. 产品信息架构与用户流程
5. 核心数据模型：FloorPlan JSON
6. 功能需求
7. 空间规则与反馈引擎
8. 保存与数据生命周期
9. 图片转户型实验室
10. CubiCasa 转图 MVP
11. 技术架构建议
12. 埋点与评估指标
13. MVP 验收标准
14. 里程碑与迭代边界
15. 风险与待验证事项
16. 附录：示例 Schema 与参考资料

---

# 1. 产品概述

本产品是一款轻量级 Web 户型空间验证工具。用户从标准户型库选择户型，在保持建筑拓扑基本稳定的前提下微调墙体尺寸、移动门窗、摆放家具，并通过碰撞、通行宽度和家具间距规则快速判断空间是否合适。

首版不以“专业 CAD”或“全自动户型识别”为目标，而是验证三个核心价值：

- 标准户型能否快速复用；
- 用户能否低成本微调空间；
- 家具摆放后的空间反馈是否足够有用。

> **核心假设**：多数用户并不需要重画整套户型，而是希望在一个“足够接近”的标准户型上做尺寸微调，再验证家具能否合理摆放。

---

# 2. MVP 目标与非目标

## 2.1 MVP 目标

- 提供 20–50 个经过校验的标准户型 JSON，用户可浏览并进入编辑。
- 显示主要墙体尺寸，并允许水平/垂直墙在有限范围内平移。
- 门窗绑定到墙，可沿墙移动；门窗随墙体变化保持附着关系。
- 提供基础家具库，支持拖入、移动、旋转、删除。
- 提供碰撞、门开启区、基础动线和家具净距提示。
- 全部编辑状态在浏览器本地保存，刷新后可恢复。
- 提供隐藏的“图片转户型实验室”，验证 CubiCasa 路线，并统一转换为 `FloorPlan JSON`。

## 2.2 明确非目标

- 不做专业 CAD 级自由绘图、任意斜墙/弧墙/复杂节点编辑。
- 不做结构安全、施工规范或建筑审批判断。
- 不要求首版 AI 识图达到无需人工校正。
- 不做多人实时协作、云端账号体系和跨端同步。
- 不做高质量 3D 渲染；首版以 2D 空间验证为主。
- 不支持任意拓扑级增删房间或拆墙重建。

---

# 3. 用户与核心场景

| 用户/场景 | 主要任务 | 成功标准 |
|---|---|---|
| 普通居住用户 | 选择接近自家户型，微调尺寸，摆放床/沙发/桌柜 | 10 分钟内完成一版空间验证 |
| 产品内部运营/数据人员 | 制作和校正标准户型数据 | 单户型可快速校正并保存 JSON |
| 研发/算法验证 | 测试户型图片自动转结构数据 | 能统计识别质量、人工修复量和转图耗时 |

---

# 4. 产品信息架构与用户流程

## 4.1 主产品流程

1. 进入户型库。
2. 筛选/选择标准户型。
3. 进入编辑器。
4. 查看和校准尺寸。
5. 微调水平或垂直墙。
6. 移动门窗（可选）。
7. 拖入家具并调整位置/旋转。
8. 查看空间规则反馈。
9. 本地保存方案。
10. 再次打开继续编辑。

## 4.2 隐藏实验室流程

1. 上传 PNG/JPG 户型图。
2. 执行 CubiCasa 识别。
3. 显示原图与 segmentation / 结构化预览。
4. 运行 `Topology Normalizer`。
5. 如图片缺少真实世界尺度，执行两点长度标定。
6. 进入校正模式。
7. 保存为标准 `FloorPlan JSON`。
8. 记录识别耗时、人工修复次数与最终状态。

---

# 5. 核心数据模型：FloorPlan JSON

编辑器、预置户型和图片识别模块必须共享同一份规范化数据模型。AI 模型不得直接驱动 UI；其输出必须先经过 Adapter / Topology Normalizer。

| 实体 | 关键字段 | 说明 |
|---|---|---|
| Vertex | `id, x, y` | 统一使用真实世界单位，建议 mm |
| Wall | `id, from, to, thickness, lockAxis` | `from/to` 引用 Vertex；MVP 限制水平/垂直 |
| Room | `id, type, boundaryWallIds` | 房间由墙体拓扑定义，必要时缓存 polygon |
| Opening | `id, type, wallId, position, width` | `position` 为墙上 0–1 的相对位置 |
| FurnitureDefinition | `id, category, defaultSize, clearanceRules` | 家具库定义 |
| FurnitureInstance | `id, definitionId, x, y, width, depth, rotation` | 具体摆放实例 |
| PlanMeta | `version, unit, name, source` | 记录 schema 版本与来源 |

> **关键建模决策**：门窗不要仅保存绝对 `x/y`，而应绑定 `wallId + position`。这样墙体长度变化时，门窗仍然保持在墙上。

---

# 6. 功能需求

## 6.1 标准户型库

| ID | 需求 | 优先级 | 验收 |
|---|---|---|---|
| P1-01 | 展示 20–50 个标准户型缩略图、名称、面积/房型等基础信息 | P0 | 可从列表进入编辑器 |
| P1-02 | 加载 `FloorPlan JSON` 并正确渲染墙、房间、门窗、尺寸 | P0 | 无拓扑断裂、显示与数据一致 |
| P1-03 | 复制为“我的方案”后编辑，不修改原始模板 | P0 | 模板数据只读 |

## 6.2 尺寸显示与墙体微调

- 默认显示主要外墙/房间尺寸，可通过设置隐藏。
- 仅支持水平墙和垂直墙的法向平移；不支持首版自由旋转墙。
- 移动墙时共享顶点同步更新，并保持相邻墙连接。
- 墙体移动需有限制范围，避免房间翻转、墙交叉、面积为负。
- 修改后实时更新尺寸与受影响房间面积；面积展示可列为 P1。

## 6.3 门窗编辑

- 门窗附着在 `wallId` 上，用户可沿墙拖动。
- 门窗不得越过墙端；最小边距可配置。
- 墙长度变化后，默认保持相对位置；未来可增加“保持距端距离”模式。
- 首版不要求复杂的门开启方向交互；如实现成本低，可提供 90° / 翻转。

## 6.4 家具库与编辑

| 能力 | MVP 行为 |
|---|---|
| 家具分类 | 床、沙发、茶几、餐桌、椅、衣柜、电视柜、书桌等基础集合 |
| 拖入 | 从侧栏拖入画布；默认使用 `FurnitureDefinition` 尺寸 |
| 移动 | 自由拖动，支持可选网格/墙体吸附 |
| 旋转 | 至少支持 90° 步进；自由角度非必须 |
| 删除 | 键盘 Delete/Backspace 或属性面板删除 |
| 尺寸 | 首版可允许少量常见尺寸档位；不要求任意缩放 |
| 选中态 | 展示外框、尺寸、旋转控制与属性 |

## 6.5 Undo / Redo

建议列为 P0 技术能力。墙体、门窗、家具的每次有效编辑均形成 Command，支持至少 30 步 Undo / Redo。

---

# 7. 空间规则与反馈引擎

规则引擎采用确定性 Geometry Rule，不依赖大模型。反馈以“错误 / 警告 / 建议”三级展示，避免把通用建议包装成强制规范。

| 规则类别 | 示例 | 首版 |
|---|---|---|
| 边界/碰撞 | 家具超出房间；家具与墙体重叠；家具互相重叠 | P0 |
| 门开启区 | 家具侵入门扇/门口关键区域 | P0 |
| 通行宽度 | 主要通道净宽低于配置值 | P0 |
| 家具净距 | 床侧/床尾、餐桌周边、衣柜开门前空间不足 | P0 |
| 布局建议 | 电视观看距离、桌椅关系等 | P1 |

规则参数应配置化，不硬编码在 UI。例如 `BedRule` 可定义 `left/right/foot clearance`；规则结果应包含：

- `ruleId`
- `severity`
- 相关对象 id
- 实测值
- 建议值
- 可读文案

---

# 8. 保存与数据生命周期

- 标准模板随前端静态资源发布，保持只读。
- 用户编辑方案存入 IndexedDB；LocalStorage 仅保存轻量 UI 偏好或最近方案 ID。
- 方案数据包括 `FloorPlan JSON`、编辑器视口、更新时间和 `schemaVersion`。
- 升级 schema 时提供 migration；至少兼容当前版本与前一版本。
- 提供“导出 JSON”作为开发/数据制作能力；用户版是否开放可后置。

---

# 9. 图片转户型实验室

实验室默认不出现在普通用户主导航，仅通过开发开关或内部入口进入。目标不是直接承诺自动生成，而是建立可量化的识别评估和数据生产流水线。

| 模块 | 职责 |
|---|---|
| Uploader | 上传 PNG/JPG；记录原图尺寸与哈希 |
| CubiCasa Adapter | 调用 CubiCasa 推理，并转换原始输出 |
| Raw Result Viewer | 展示 mask / semantic 结果 |
| Topology Normalizer | 转为 `Vertex / Wall / Room / Opening` |
| Calibration | 通过已知长度两点标定 mm/px；无真实尺度时标记为 `unscaled` |
| Correction Editor | 复用主编辑器进行墙、门窗校正 |
| Evaluator | 记录模型版本、耗时、自动结果、人工修改次数和最终 JSON |

## 9.1 实验室定位

图片转户型在首版属于**内部数据生产和可行性验证能力**，不是主产品的核心承诺。

推荐首先用于：

1. 批量生成标准户型初始数据；
2. 通过人工校正缩短单户型制作时间；
3. 积累真实图片 → 修正后 `FloorPlan JSON` 的数据对；
4. 验证未来是否值得开放“用户上传户型图”功能。

---

# 10. CubiCasa 转图 MVP

## 10.1 目标

验证“语义分割 + 几何后处理”能否稳定产出可编辑的 `FloorPlan JSON`，并作为相对轻量、易本地验证的图片转户型路线。

首版重点不是追求全自动正确，而是回答：

> **使用 CubiCasa 生成初稿后，人工把一个真实户型修到可用状态需要多久？**

## 10.2 MVP 输入/输出

| 阶段 | 输入 | 输出 |
|---|---|---|
| 预处理 | JPG / PNG | 统一尺寸图像 + scale metadata |
| Segmentation | 图像 | wall / opening / room 等语义 mask 或概率图 |
| Geometry Extraction | mask | 轮廓、中心线、候选墙段、门窗区域 |
| Topology Normalization | 几何候选 | `FloorPlan JSON` |
| Calibration | 图片 + 已知长度 | `mmPerPixel` / scale metadata |
| 人工校正 | `FloorPlan JSON` | approved `FloorPlan JSON` |

## 10.3 后处理建议

- 对 wall mask 做 morphology closing / thinning / line fitting，提取水平与垂直主墙段。
- 将接近且共线的墙段 merge，近邻端点 snap 到统一 Vertex。
- 从 room mask 获取房间 polygon，并通过边界与墙段关系构造 adjacency。
- 门窗检测后寻找最近墙并转成 `wallId + position + width`。
- 对小噪声、多余短边和重复 polygon 设置阈值过滤。
- 如果原图带家具，需评估是否会污染 room/wall segmentation；必要时建立输入风格分类。

## 10.4 尺度标定

CubiCasa 负责识别几何和语义，但图片本身不一定包含可靠的真实世界比例尺。

首版采用人工两点标定：

1. 用户在原图上选择两个点；
2. 输入该线段真实长度，例如 `3200 mm`；
3. 系统计算：

```ts
mmPerPixel = realLengthMm / selectedPixelLength
```

4. 将全部几何统一转换为毫米单位。

没有完成标定时：

- 可以继续编辑相对几何；
- 数据标记为 `unscaled`；
- 不输出依赖真实尺寸的净距结论。

## 10.5 本地验证策略

优先在 Apple Silicon 上验证可用实现；基于 CubiCasa5K 训练的实现可优先选择支持 CPU / MPS 的版本。

PRD 不锁定具体 fork，最终以以下因素决定：

- 真实测试样本效果；
- Apple Silicon / 服务端推理兼容性；
- 项目许可证；
- 模型权重许可证；
- 社区维护情况；
- 输出是否容易转换成统一拓扑。

## 10.6 数据验证集

建议第一轮准备 50–100 张真实业务风格图片，覆盖：

- 高清黑白户型；
- 低清截图；
- 中文文字标注；
- 带尺寸线；
- 带家具；
- 无家具；
- 彩色户型；
- CAD 风格；
- 房地产平台常见展示风格；
- 不规则轮廓户型。

## 10.7 CubiCasa MVP 验收指标

| 指标 | 建议目标（验证期） |
|---|---|
| 成功完成推理 | ≥ 95% 测试图片不崩溃 |
| 主房间数量 | 多数普通户型数量基本正确 |
| 主墙结构 | 主要外墙/分隔墙可通过少量修正恢复 |
| 门窗 attach | 能附着到合理墙体；错误可快速手工修复 |
| 人工修复时间 | 记录中位数、P75、P90，作为核心产品判断指标 |
| 结果可用性 | 修复后能进入主编辑器完成家具摆放 |
| 数据生产效率 | 与完全人工绘制同一户型所需时间比较 |

## 10.8 实验判断标准

CubiCasa 路线是否继续投入，不只看 segmentation 指标，而以实际数据生产效率为核心。

建议记录：

```text
原图
 ↓
CubiCasa
 ↓
Topology Normalizer
 ↓
人工校正
 ↓
approved FloorPlan

wallFixCount
openingFixCount
roomFixCount
manualCorrectionSec
```

如果 AI 初稿能显著减少人工建模时间，即使无法完全自动生成，也具备产品价值。

---

# 11. 技术架构建议

## 11.1 前端

| 模块 | 建议 |
|---|---|
| 框架 | React + TypeScript |
| 状态 | Zustand 或等价轻量状态管理 |
| 2D 渲染 | SVG 优先；复杂度增加后再评估 Canvas / Konva |
| 几何 | 自建轻量 Geometry Engine；必要时使用成熟 polygon 库 |
| 持久化 | IndexedDB |
| Undo / Redo | Command Pattern / immutable patches |
| AI Adapter | 独立接口，不进入编辑器核心 store |

## 11.2 模块边界

```text
src/
├─ model/
│  ├─ FloorPlan.ts
│  ├─ schema.ts
│  └─ migrations.ts
├─ geometry/
│  ├─ intersection.ts
│  ├─ distance.ts
│  ├─ polygon.ts
│  └─ topology.ts
├─ editor/
│  ├─ selection/
│  ├─ drag/
│  ├─ snapping/
│  └─ commands/
├─ render/
│  ├─ Wall.tsx
│  ├─ Opening.tsx
│  ├─ Furniture.tsx
│  └─ Dimension.tsx
├─ furniture/
│  ├─ definitions.ts
│  └─ instances.ts
├─ rules/
│  ├─ collision.ts
│  ├─ clearance.ts
│  └─ circulation.ts
├─ storage/
│  └─ indexedDb.ts
├─ importers/
│  ├─ staticPlan/
│  └─ cubicasa/
└─ lab/
   └─ imageRecognition/
```

## 11.3 图片识别接口建议

编辑器不直接理解 CubiCasa 的原始 mask 格式。

建议定义：

```ts
interface FloorplanImporter<TRaw> {
  predict(image: Blob): Promise<TRaw>
  normalize(raw: TRaw, context: NormalizeContext): Promise<FloorPlan>
}
```

CubiCasa 实现：

```ts
class CubiCasaImporter implements FloorplanImporter<CubiCasaPrediction> {
  async predict(image: Blob) {
    // local MPS / server API / worker adapter
  }

  async normalize(raw: CubiCasaPrediction, context: NormalizeContext) {
    // mask → geometry → topology → FloorPlan
  }
}
```

这样未来更换识别模型时，不需要修改主编辑器的数据模型和状态管理。

## 11.4 推荐运行边界

```text
                    主产品

Browser
┌───────────────────────────────┐
│ React Editor                  │
│ FloorPlan JSON                │
│ SVG                           │
│ Geometry / Rules              │
│ IndexedDB                     │
└───────────────────────────────┘

                    数据生产实验

户型图片
   ↓
CubiCasa Inference
   ↓
Semantic Masks
   ↓
Geometry Extraction
   ↓
Topology Normalizer
   ↓
Correction Editor
   ↓
approved FloorPlan JSON
   ↓
标准户型库
```

主产品运行不依赖 AI 服务在线可用。

---

# 12. 埋点与评估指标

| 类别 | 指标 |
|---|---|
| 主产品 | 选户型 → 开始编辑转化率、单次编辑时长、家具添加数量、规则触发数量、保存率 |
| 编辑体验 | Undo 次数、非法墙体移动拦截次数、门窗拖动失败次数 |
| 识图实验 | 推理耗时、模型版本、房间数误差、墙体修复次数、门窗修复次数、人工修复时长 |
| 数据生产 | 每个 approved 户型从原图到成品的总耗时、来源、校对人、模型/参数版本 |

## 12.1 核心实验指标

图片转户型实验最重要的指标为：

**人工修复时间（Manual Correction Time）**

建议同时统计：

- Median
- P75
- P90
- 完全人工制作基线时间
- AI 辅助后的时间节省比例

例如：

```text
完全人工制作：18 min
CubiCasa + 修正：3.5 min

节省时间：约 81%
```

该指标比单独比较模型论文指标更接近真实产品价值。

---

# 13. MVP 验收标准

| 模块 | 必须通过的验收条件 |
|---|---|
| 标准户型 | 至少 20 套模板可正确加载和编辑；无明显断墙/重叠 |
| 墙体调整 | 水平/垂直墙可小范围移动；相邻墙连接不丢失；非法移动被阻止 |
| 门窗 | 可沿绑定墙移动；墙体变化后仍在墙上 |
| 家具 | 支持拖入、移动、90° 旋转、删除；刷新后恢复 |
| 规则 | 家具重叠、越界、关键门口/通道问题可产生可理解反馈 |
| 存储 | IndexedDB 保存、读取、覆盖正常；`schemaVersion` 存在 |
| 识图实验室 | CubiCasa 路线可从图片得到可校正结构，并进入校正编辑器 |
| 统一数据 | CubiCasa 结果最终能转换到与模板相同的 `FloorPlan` schema |
| 数据生产 | 修正完成后的户型可以保存为 approved 标准户型 JSON |

---

# 14. 里程碑与迭代边界

| 阶段 | 范围 | 交付物 |
|---|---|---|
| M0 · 数据骨架 | Schema、SVG renderer、5 个手工户型 | `FloorPlan v1` + 静态 Viewer |
| M1 · 编辑器核心 | 墙体移动、尺寸、Undo/Redo、门窗 attach | 可编辑 20–50 个模板 |
| M2 · 家具与规则 | 家具库、拖放、碰撞/净距/通道 | 首个可用产品闭环 |
| M3 · 本地保存 | IndexedDB、方案管理、导出 JSON | 可持续使用的 MVP |
| M4 · CubiCasa Lab | 上传、推理、mask → topology、校正、评估 | 可量化的转图流水线 |
| M5 · 数据扩充 | 批量转图 + 人工校对 + 标准户型入库 | 持续扩充的标准户型数据源 |

不建议在 M2 之前投入复杂 AI 识图工程。主编辑器先能稳定消费“正确 JSON”，之后再解决“JSON 从哪里来”。

---

# 15. 风险与待验证事项

| 风险 | 影响 | 应对 |
|---|---|---|
| 墙体微调破坏拓扑 | 编辑器不可用 | 限制轴向移动；统一顶点；增加几何约束与事务回滚 |
| 门窗/家具规则定义争议 | 反馈不可信 | 规则配置化并标注为建议；不冒充建筑规范 |
| AI 对真实中文房产图泛化差 | 转图价值不足 | 用真实样本验证；统计人工修复时间，而非只看论文指标 |
| 缺少真实尺度 | 家具判断失真 | 提供两点长度标定；未标定时禁止输出真实净距结论 |
| CubiCasa 实现/模型许可不适合商业化 | 上线受限 | 上线前独立完成代码、模型、数据集许可证审查；Importer 保持可替换 |
| segmentation 后处理复杂 | 自动结果拓扑不稳 | 将 Topology Normalizer 作为独立核心模块，保留人工校正流程 |
| 模板覆盖不足 | 用户找不到接近户型 | 先按常见 1/2/3 房、横厅/竖厅、主要轮廓分类扩充 |

---

# 附录 A：FloorPlan v1 示例

```json
{
  "version": 1,
  "unit": "mm",
  "meta": {
    "name": "3BR-A",
    "source": "template"
  },
  "vertices": [
    { "id": "v1", "x": 0, "y": 0 },
    { "id": "v2", "x": 4200, "y": 0 }
  ],
  "walls": [
    {
      "id": "w1",
      "from": "v1",
      "to": "v2",
      "thickness": 120,
      "lockAxis": "horizontal"
    }
  ],
  "openings": [
    {
      "id": "win1",
      "type": "window",
      "wallId": "w1",
      "position": 0.55,
      "width": 1500
    }
  ],
  "rooms": [],
  "furniture": []
}
```

---

# 附录 B：识图实验数据记录建议

| 字段 | 示例 |
|---|---|
| `imageId` | `img_00031` |
| `engine` | `cubicasa` |
| `modelVersion` | commit / checkpoint hash |
| `inferenceMs` | `1840` |
| `roomCountRaw` | `7` |
| `roomFixCount` | `1` |
| `wallFixCount` | `3` |
| `openingFixCount` | `2` |
| `manualCorrectionSec` | `74` |
| `scaled` | `true` |
| `approved` | `true` |
| `finalPlanId` | `plan_00214` |

推荐额外保存原始图片 hash、原始模型输出和最终 JSON，以便后续重新评估算法效果。

---

# 附录 C：外部技术参考

- CubiCasa5K 官方仓库：<https://github.com/CubiCasa/CubiCasa5k>  
  作为户型图语义理解的数据集和模型路线参考。

- 社区工程参考 floorplan-to-3d：<https://github.com/Yytsi/floorplan-to-3d>  
  可用于了解基于 CubiCasa5K segmentation 的图片 → 几何处理流程，以及 Apple Silicon / MPS 路线的工程可行性。

> **许可证提示**：第三方代码、模型权重和数据集的许可证需要在实际商业发布前重新独立确认。PRD 中的技术引用只作为验证与架构规划参考。
