import * as React from "react";
import type { StandardFloorPlan } from "./types";
import type { RuleResult } from "./rules/types";

export type FloorPlanLocale = "en" | "zh";

export interface FloorPlanDictionary {
  pageTitle: string;
  pageDescription: string;
  badges: {
    userDraft: string;
    saved: string;
    saving: string;
    saveFailed: string;
    draft: string;
    uncalibrated: string;
    unscaledAdvisory: string;
    issue: string;
    issues: string;
    warning: string;
    warnings: string;
  };
  canvasModes: {
    pan: string;
    panTooltip: string;
    edit: string;
    editTooltip: string;
  };
  actions: {
    customizePlan: string;
    plans: string;
    rules: string;
    undo: string;
    redo: string;
    addFurniture: string;
    exportJson: string;
    restart: string;
    restartTitle: string;
    close: string;
  };
  draftBanner: {
    foundDraft: string;
    continueDraft: string;
    restartTemplate: string;
  };
  catalog: {
    title: string;
    approvedBadge: string;
    searchPlaceholder: string;
    allFilter: string;
    openPlan: string;
    currentPlanBadge: string;
    noResults: string;
    noResultsSub: string;
  };
  inspector: {
    title: string;
    noSelectionTitle: string;
    noSelectionDesc: string;
    planSummaryTitle: string;
    totalArea: string;
    roomCount: string;
    furnitureCount: string;
    wallCount: string;
    openingCount: string;
    wallDetails: string;
    wallId: string;
    wallLength: string;
    wallThickness: string;
    wallLockAxis: string;
    associatedOpenings: string;
    none: string;
    roomDetails: string;
    roomId: string;
    roomName: string;
    roomType: string;
    calculatedArea: string;
    widthSpan: string;
    depthSpan: string;
    adjustSpans: string;
    openingDetails: string;
    openingId: string;
    openingType: string;
    door: string;
    window: string;
    openingWidth: string;
    openingHeight: string;
    openingPosition: string;
    openingMargin: string;
    furnitureDetails: string;
    furnitureItem: string;
    furnitureCategory: string;
    furnitureDimensions: string;
    furniturePosition: string;
    furnitureRotation: string;
    rotate90: string;
    resetDimensions: string;
    deleteFurniture: string;
    adjustDimensions: string;
  };
  roomSpanEditor: {
    title: string;
    widthAxis: string;
    depthAxis: string;
    targetSpan: string;
    boundarySide: string;
    moveMax: string;
    moveMin: string;
    preview: string;
    apply: string;
    cancel: string;
    cannotResolve: string;
    successApplied: string;
  };
  openingEditor: {
    title: string;
    width: string;
    position: string;
    endMargin: string;
    preview: string;
    apply: string;
    cancel: string;
    cannotResolve: string;
  };
  furnitureEditor: {
    notFound: string;
    coordinates: string;
    width: string;
    depth: string;
    stepUnit: string;
    decWidth: string;
    incWidth: string;
    decDepth: string;
    incDepth: string;
    invalidCoordinates: string;
    previewSize: string;
    rotation: string;
    preview: string;
    apply: string;
    reset: string;
    rotate90: string;
    delete: string;
    deleteTitle: string;
  };
  furniturePalette: {
    title: string;
    searchPlaceholder: string;
    allCategory: string;
    addToPlan: string;
    noResults: string;
  };
  contextFurniture: {
    recommendedTitle: string;
    recommendedBeds: string;
    recommendedSofas: string;
    recommendedTables: string;
    recommendedDesks: string;
    defaultDimensions: string;
    addBtn: string;
    browseFullCatalog: string;
    noTargetRoom: string;
    promptText: string;
  };
  rules: {
    title: string;
    allPassed: string;
    unscaledNotice: string;
    measured: string;
    recommended: string;
    affected: string;
    titles: {
      boundaryViolation: string;
      wallCollision: string;
      furnitureOverlap: string;
      openingKeepClear: string;
      furnitureClearance: string;
      passageClearance: string;
    };
  };
  svgViewer: {
    zoomIn: string;
    zoomOut: string;
    fitView: string;
    reset: string;
    unscaledNotice: string;
  };
  mobileSheet: {
    roomProperties: string;
    wallProperties: string;
    openingProperties: string;
    furnitureProperties: string;
    dimensionProperties: string;
    entityProperties: string;
    furnitureCatalog: string;
    spatialRules: string;
    standardPlans: string;
    details: string;
  };
  lab: {
    title: string;
    description: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    samplePlans: string;
    uploadImage: string;
    chooseFile: string;
    selectedFile: string;
    point1: string;
    point2: string;
    knownLength: string;
    pixelDistance: string;
    calculatedScale: string;
    calibrateScale: string;
    skipCalibration: string;
    unscaledModeNotice: string;
    runInference: string;
    runningInference: string;
    inferenceError: string;
    evalReportTitle: string;
    exportReport: string;
    openEditor: string;
    returnToLab: string;
    approvePlan: string;
    approvedNotice: string;
    wallCount: string;
    openingCount: string;
    roomCount: string;
    furnitureCount: string;
    topologyStatus: string;
    serviceUnavailable: string;
  };
  workflow: {
    steps: {
      plan: string;
      room: string;
      furniture: string;
      decision: string;
    };
    stepDescriptions: {
      plan: string;
      room: string;
      furniture: string;
      decision: string;
    };
    actions: {
      choosePlan: string;
      changePlan: string;
      calibrateDimensions: string;
      skipCalibration: string;
      nextToRoom: string;
      backToPlan: string;
      nextToFurniture: string;
      backToRoom: string;
      nextToDecision: string;
      backToFurniture: string;
      restartPlan: string;
    };
    planStage: {
      title: string;
      description: string;
      currentPlanLabel: string;
      calibratePrompt: string;
      accurateNotice: string;
      stepTag: string;
    };
    roomStage: {
      title: string;
      description: string;
      placeholder: string;
      stepTag: string;
    };
    furnitureStage: {
      title: string;
      description: string;
      placeholder: string;
      stepTag: string;
    };
    decisionStage: {
      title: string;
      description: string;
      placeholder: string;
      stepTag: string;
    };
  };
}

export const FLOOR_PLAN_ZH: FloorPlanDictionary = {
  pageTitle: "标准户型空间验证器",
  pageDescription: "标准户型库浏览与响应式 SVG 空间验证，精确验证房间边界、洞口位置及家具活动间距。",
  badges: {
    userDraft: "(用户草稿)",
    saved: "已保存",
    saving: "保存中...",
    saveFailed: "保存失败",
    draft: "草稿",
    uncalibrated: "未标定（抑制间距检查）",
    unscaledAdvisory: "未标定几何尺寸：依赖真实毫米尺度的间距规则已抑制",
    issue: "处问题",
    issues: "处问题",
    warning: "处警告",
    warnings: "处警告",
  },
  canvasModes: {
    pan: "平移",
    panTooltip: "平移模式（纯手势平移，避免误触实体）",
    edit: "编辑",
    editTooltip: "编辑模式（点击选择实体并微调参数）",
  },
  actions: {
    customizePlan: "自定义户型",
    plans: "户型库",
    rules: "空间规范",
    undo: "撤销",
    redo: "重做",
    addFurniture: "+ 放置家具",
    exportJson: "导出 JSON",
    restart: "重置",
    restartTitle: "重置为模板初始状态",
    close: "关闭",
  },
  draftBanner: {
    foundDraft: "检测到该户型存在已保存的本地草稿",
    continueDraft: "继续编辑草稿",
    restartTemplate: "恢复模板初始状态",
  },
  catalog: {
    title: "标准户型库",
    approvedBadge: "套已收录",
    searchPlaceholder: "搜索标准户型方案...",
    allFilter: "全部",
    openPlan: "载入方案",
    currentPlanBadge: "当前编辑",
    noResults: "未找到匹配的户型方案",
    noResultsSub: "请尝试更换关键词或清除标签筛选",
  },
  inspector: {
    title: "空间属性检查器",
    noSelectionTitle: "未选中实体",
    noSelectionDesc: "在画布上点击任意墙体、房间、门窗或家具，即可查看几何参数并微调尺寸。",
    planSummaryTitle: "户型全局概览",
    totalArea: "套内总面积",
    roomCount: "功能分区数",
    furnitureCount: "家具配置数",
    wallCount: "墙体结构数",
    openingCount: "门窗洞口数",
    wallDetails: "墙体参数",
    wallId: "墙体编号",
    wallLength: "墙体长度",
    wallThickness: "墙体厚度",
    wallLockAxis: "轴向锁定",
    associatedOpenings: "关联洞口",
    none: "无",
    roomDetails: "房间参数",
    roomId: "房间编号",
    roomName: "空间名称",
    roomType: "空间类型",
    calculatedArea: "实测建筑面积",
    widthSpan: "开间跨度 (X)",
    depthSpan: "进深跨度 (Y)",
    adjustSpans: "微调房间开间/进深",
    openingDetails: "门窗洞口参数",
    openingId: "洞口编号",
    openingType: "洞口类型",
    door: "门",
    window: "窗",
    openingWidth: "净宽",
    openingHeight: "净高",
    openingPosition: "沿墙体相对位置",
    openingMargin: "端头避让预留",
    furnitureDetails: "家具属性与尺寸",
    furnitureItem: "家具名称",
    furnitureCategory: "所属分类",
    furnitureDimensions: "平面尺寸 (宽 × 深 × 高)",
    furniturePosition: "坐标位置 (X, Y)",
    furnitureRotation: "旋转角度",
    rotate90: "顺时针旋转 90°",
    resetDimensions: "重置为标准尺寸",
    deleteFurniture: "删除此家具",
    adjustDimensions: "尺寸与位置调整",
  },
  roomSpanEditor: {
    title: "房间开间与进深微调",
    widthAxis: "开间宽度 (X)",
    depthAxis: "进深长度 (Y)",
    targetSpan: "目标尺寸 (mm)",
    boundarySide: "移动哪一侧边界墙体",
    moveMax: "移动右侧/下侧边界墙体",
    moveMin: "移动左侧/上侧边界墙体",
    preview: "预览调整",
    apply: "确认应用",
    cancel: "取消",
    cannotResolve: "无法自动解析该房间的矩形边界，暂不支持快速开间进深微调。",
    successApplied: "房间开间微调已成功应用！",
  },
  openingEditor: {
    title: "门窗洞口微调",
    width: "洞口宽度 (mm)",
    position: "沿墙相对位置 (0~1)",
    endMargin: "端头预留避让 (mm)",
    preview: "预览调整",
    apply: "确认应用",
    cancel: "取消",
    cannotResolve: "未找到对应的关联墙体或洞口数据",
  },
  furnitureEditor: {
    notFound: "未在当前户型中找到该家具构件。",
    coordinates: "平面坐标 (X, Y)",
    width: "宽度",
    depth: "进深",
    stepUnit: "步长",
    decWidth: "减少宽度",
    incWidth: "增加宽度",
    decDepth: "减少进深",
    incDepth: "增加进深",
    invalidCoordinates: "X 和 Y 坐标必须为有效数值。",
    previewSize: "预览尺寸：",
    rotation: "旋转角度：",
    preview: "预览调整",
    apply: "确认应用",
    reset: "重置输入",
    rotate90: "顺时针旋转 90°",
    delete: "删除",
    deleteTitle: "删除此家具",
  },
  furniturePalette: {
    title: "家具构件库",
    searchPlaceholder: "搜索家具构件...",
    allCategory: "全部",
    addToPlan: "添加到户型",
    noResults: "未找到匹配的家具构件",
  },
  contextFurniture: {
    recommendedTitle: "推荐家具",
    recommendedBeds: "推荐床类选项",
    recommendedSofas: "推荐沙发选项",
    recommendedTables: "推荐餐桌选项",
    recommendedDesks: "推荐书桌选项",
    defaultDimensions: "默认尺寸",
    addBtn: "添加并检测",
    browseFullCatalog: "浏览完整家具目录",
    noTargetRoom: "请先选择目标房间",
    promptText: "已根据当前房间功能为您匹配最适家具：",
  },
  rules: {
    title: "空间规范审查",
    allPassed: "所有房间边界、活动净距、门窗避让及家具摆放规范检查通过。",
    unscaledNotice: "未标定真实尺寸：依赖毫米绝对尺度的间距规则已抑制。",
    measured: "实测值：",
    recommended: "规范建议：",
    affected: "关联实体：",
    titles: {
      boundaryViolation: "房间边界越界",
      wallCollision: "墙体结构穿插碰撞",
      furnitureOverlap: "家具重叠冲突",
      openingKeepClear: "门窗开启通行净区受阻",
      furnitureClearance: "家具使用净距不足",
      passageClearance: "通道通行净宽不足",
    },
  },
  svgViewer: {
    zoomIn: "放大",
    zoomOut: "缩小",
    fitView: "适屏居中",
    reset: "重置缩放",
    unscaledNotice: "未标定真实比例（显示相对像素坐标）",
  },
  mobileSheet: {
    roomProperties: "房间属性",
    wallProperties: "墙体属性",
    openingProperties: "洞口属性",
    furnitureProperties: "家具属性",
    dimensionProperties: "尺寸标注",
    entityProperties: "实体属性",
    furnitureCatalog: "家具构件库",
    spatialRules: "空间规范反馈",
    standardPlans: "标准户型库",
    details: "详细信息",
  },
  lab: {
    title: "CubiCasa 识图实验室",
    description: "CubiCasa 户型图片识别、两点尺度标定与拓扑规整实验室",
    step1Title: "第一步：选择户型底图",
    step1Desc: "选用内置代表性样例或上传自定义光栅户型图",
    step2Title: "第二步：两点尺度标定",
    step2Desc: "设定已知距离的两个基准点建立毫米坐标系",
    step3Title: "第三步：模型识别与拓扑规整",
    step3Desc: "运行语义分割、拓扑规整并评估几何精度",
    samplePlans: "示例户型底图",
    uploadImage: "上传自定义户型图",
    chooseFile: "选择图片文件",
    selectedFile: "已选图片",
    point1: "标定参考点 A",
    point2: "标定参考点 B",
    knownLength: "已知两点真实距离 (mm)",
    pixelDistance: "像素跨度",
    calculatedScale: "标定比例换算",
    calibrateScale: "完成两点标定",
    skipCalibration: "跳过标定（使用未标定相对像素几何）",
    unscaledModeNotice: "未标定模式：保留相对像素几何，抑制绝对尺寸规则",
    runInference: "运行 CubiCasa 智能识别",
    runningInference: "正在进行图像分割与拓扑规整...",
    inferenceError: "识别运行出错",
    evalReportTitle: "评测与规整基准报告",
    exportReport: "导出评测报告 (JSON)",
    openEditor: "进入编辑器精细微调",
    returnToLab: "返回识图实验室",
    approvePlan: "审核通过并定稿",
    approvedNotice: "该识别方案已成功审核定稿",
    wallCount: "识别墙体数",
    openingCount: "识别门窗数",
    roomCount: "识别房间数",
    furnitureCount: "识别家具数",
    topologyStatus: "拓扑连续性闭合",
    serviceUnavailable: "CubiCasa recognition service is currently unavailable",
  },
  workflow: {
    steps: {
      plan: "户型",
      room: "房间",
      furniture: "家具",
      decision: "结论",
    },
    stepDescriptions: {
      plan: "选择并校准户型",
      room: "选择检测房间",
      furniture: "添加目标家具",
      decision: "尺寸决策与微调",
    },
    actions: {
      choosePlan: "选择标准户型",
      changePlan: "更换户型",
      calibrateDimensions: "微调房间开间进深",
      skipCalibration: "跳过校准，进入房间选择",
      nextToRoom: "进入房间阶段",
      backToPlan: "返回户型阶段",
      nextToFurniture: "进入家具阶段",
      backToRoom: "返回房间阶段",
      nextToDecision: "查看决策结论",
      backToFurniture: "返回家具阶段",
      restartPlan: "重新载入标准模板",
    },
    planStage: {
      title: "户型确认与校准",
      description: "确认标准户型；如尺寸与实际住宅不同可微调房间开间，若模板已足够准确可直接跳过。",
      currentPlanLabel: "当前户型方案",
      calibratePrompt: "房间尺寸校准（可选）",
      accurateNotice: "模板尺寸已符合实际住宅，无需调整",
      stepTag: "步骤 1/4",
    },
    roomStage: {
      title: "选择目标房间",
      description: "在画布或列表中选择本次需要进行家具尺寸检测的房间。",
      placeholder: "请在画布中点击需要检测的房间，以确定空间范围与建议规则。",
      stepTag: "步骤 2/4",
    },
    furnitureStage: {
      title: "添加与配置家具",
      description: "选择床或沙发等目标家具，放入当前房间进行尺寸检测。",
      placeholder: "请选择需要检测的目标家具规格。",
      stepTag: "步骤 3/4",
    },
    decisionStage: {
      title: "空间尺寸决策",
      description: "查看当前家具在目标房间中的通过情况与尺寸建议。",
      placeholder: "微调家具尺寸、位置或旋转，查看实时空间规则复判。",
      stepTag: "步骤 4/4",
    },
  },
};

export const FLOOR_PLAN_EN: FloorPlanDictionary = {
  pageTitle: "Floor Plan Space Validator",
  pageDescription: "Browse standard floor plans in responsive SVG viewer, verify room boundaries, openings, and furniture dimensions.",
  badges: {
    userDraft: "(User Draft)",
    saved: "Saved",
    saving: "Saving...",
    saveFailed: "Save failed",
    draft: "Draft",
    uncalibrated: "Uncalibrated (Clearances Suppressed)",
    unscaledAdvisory: "Uncalibrated geometry: Dimension-dependent clearance rules are suppressed",
    issue: "Issue",
    issues: "Issues",
    warning: "Warning",
    warnings: "Warnings",
  },
  canvasModes: {
    pan: "Pan",
    panTooltip: "Pan Canvas Mode (pure pan, prevent accidental edits)",
    edit: "Edit",
    editTooltip: "Edit Mode (select & edit entities)",
  },
  actions: {
    customizePlan: "Customize Plan",
    plans: "Plans",
    rules: "Rules",
    undo: "Undo",
    redo: "Redo",
    addFurniture: "+ Furniture",
    exportJson: "Export JSON",
    restart: "Restart",
    restartTitle: "Restart from template",
    close: "Close",
  },
  draftBanner: {
    foundDraft: "A saved draft was found for this plan",
    continueDraft: "Continue draft",
    restartTemplate: "Restart from template",
  },
  catalog: {
    title: "Standard Plans",
    approvedBadge: "approved",
    searchPlaceholder: "Search standard plans...",
    allFilter: "All",
    openPlan: "Open Plan",
    currentPlanBadge: "Current",
    noResults: "No plans found matching your search.",
    noResultsSub: "Try a different search query or clear tags filter",
  },
  inspector: {
    title: "Spatial Inspector",
    noSelectionTitle: "No Entity Selected",
    noSelectionDesc: "Click any wall, room, door, window, or furniture item on the canvas to inspect its geometric parameters and adjust dimensions.",
    planSummaryTitle: "Plan Summary",
    totalArea: "Total Area",
    roomCount: "Room Count",
    furnitureCount: "Furniture Items",
    wallCount: "Walls",
    openingCount: "Openings",
    wallDetails: "Wall Details",
    wallId: "Wall ID",
    wallLength: "Length",
    wallThickness: "Thickness",
    wallLockAxis: "Lock Axis",
    associatedOpenings: "Associated Openings",
    none: "None",
    roomDetails: "Room Details",
    roomId: "Room ID",
    roomName: "Room Name",
    roomType: "Room Type",
    calculatedArea: "Calculated Area",
    widthSpan: "Width Span (X)",
    depthSpan: "Depth Span (Y)",
    adjustSpans: "Adjust Boundaries (Spans)",
    openingDetails: "Opening Details",
    openingId: "Opening ID",
    openingType: "Type",
    door: "Door",
    window: "Window",
    openingWidth: "Width",
    openingHeight: "Height",
    openingPosition: "Position on Wall",
    openingMargin: "End Margin",
    furnitureDetails: "Furniture Details",
    furnitureItem: "Item Name",
    furnitureCategory: "Category",
    furnitureDimensions: "Dimensions (W × D × H)",
    furniturePosition: "Position (X, Y)",
    furnitureRotation: "Rotation",
    rotate90: "Rotate 90°",
    resetDimensions: "Reset Dimensions",
    deleteFurniture: "Delete Furniture",
    adjustDimensions: "Dimensions & Adjustment",
  },
  roomSpanEditor: {
    title: "Room Span Adjustment",
    widthAxis: "Width (X)",
    depthAxis: "Depth (Y)",
    targetSpan: "Target Span Distance (mm)",
    boundarySide: "Which boundary edge to move",
    moveMax: "Move Max Bound (Right/Bottom)",
    moveMin: "Move Min Bound (Left/Top)",
    preview: "Preview Changes",
    apply: "Apply Changes",
    cancel: "Cancel",
    cannotResolve: "Room boundaries cannot be automatically resolved for span editing.",
    successApplied: "Room span adjustment applied successfully!",
  },
  openingEditor: {
    title: "Door & Window Adjustment",
    width: "Width (mm)",
    position: "Position on Wall (0 to 1)",
    endMargin: "End Clearance Margin (mm)",
    preview: "Preview Changes",
    apply: "Apply Changes",
    cancel: "Cancel",
    cannotResolve: "Associated wall or opening could not be located.",
  },
  furnitureEditor: {
    notFound: "Furniture item was not found in the plan.",
    coordinates: "Coordinates (Plan Space)",
    width: "Width",
    depth: "Depth",
    stepUnit: "step",
    decWidth: "Decrease width",
    incWidth: "Increase width",
    decDepth: "Decrease depth",
    incDepth: "Increase depth",
    invalidCoordinates: "Position X and Y coordinates must be valid numbers.",
    previewSize: "Preview Size:",
    rotation: "Rotation:",
    preview: "Preview",
    apply: "Apply",
    reset: "Reset values",
    rotate90: "Rotate 90°",
    delete: "Delete",
    deleteTitle: "Delete furniture item",
  },
  furniturePalette: {
    title: "Furniture Catalog",
    searchPlaceholder: "Search furniture items...",
    allCategory: "All",
    addToPlan: "Add to Plan",
    noResults: "No furniture found matching your search.",
  },
  contextFurniture: {
    recommendedTitle: "Recommended Furniture",
    recommendedBeds: "Recommended Beds",
    recommendedSofas: "Recommended Sofas",
    recommendedTables: "Recommended Dining Tables",
    recommendedDesks: "Recommended Desks",
    defaultDimensions: "Default size",
    addBtn: "Add & Test",
    browseFullCatalog: "Browse Full Furniture Catalog",
    noTargetRoom: "Please select a target room first",
    promptText: "Matched for current room function:",
  },
  rules: {
    title: "Spatial Rules",
    allPassed: "All room boundaries, clearances, passages, and spatial rules passed.",
    unscaledNotice: "Uncalibrated scale: Dimension-dependent clearance rules are suppressed.",
    measured: "Measured:",
    recommended: "Recommended:",
    affected: "Affected:",
    titles: {
      boundaryViolation: "Boundary Violation",
      wallCollision: "Wall Collision",
      furnitureOverlap: "Furniture Overlap",
      openingKeepClear: "Opening Keep-Clear Zone",
      furnitureClearance: "Furniture Clearance Guidance",
      passageClearance: "Local Passage Clearance",
    },
  },
  svgViewer: {
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    fitView: "Fit to view",
    reset: "Reset zoom",
    unscaledNotice: "Uncalibrated geometry (relative pixel scale)",
  },
  mobileSheet: {
    roomProperties: "Room Properties",
    wallProperties: "Wall Properties",
    openingProperties: "Opening Properties",
    furnitureProperties: "Furniture Properties",
    dimensionProperties: "Dimension Properties",
    entityProperties: "Entity Properties",
    furnitureCatalog: "Furniture Catalog",
    spatialRules: "Spatial Rule Feedback",
    standardPlans: "Standard Plans",
    details: "Details",
  },
  lab: {
    title: "CubiCasa Recognition Lab",
    description: "CubiCasa floor plan recognition, two-point scale calibration, and topology normalization lab",
    step1Title: "Step 1: Image Source",
    step1Desc: "Select representative sample or upload a raster floor plan",
    step2Title: "Step 2: Two-Point Scale Calibration",
    step2Desc: "Pick 2 points with known distance to establish scale",
    step3Title: "Step 3: Recognition & Normalization",
    step3Desc: "Run semantic recognition, normalize topology and verify",
    samplePlans: "Sample Floor Plans",
    uploadImage: "Upload Custom Image",
    chooseFile: "Choose File",
    selectedFile: "Selected file",
    point1: "Point 1",
    point2: "Point 2",
    knownLength: "Known Length (mm)",
    pixelDistance: "Pixel distance",
    calculatedScale: "Calculated scale",
    calibrateScale: "Calibrate Scale",
    skipCalibration: "Skip Calibration (Produce Unscaled Geometry)",
    unscaledModeNotice: "Uncalibrated mode: Preserves relative pixel geometry without real millimeter scale",
    runInference: "Run CubiCasa Recognition",
    runningInference: "Recognizing floor plan & normalizing topology...",
    inferenceError: "Inference Error",
    evalReportTitle: "Evaluation & Benchmark Report",
    exportReport: "Export Evaluation Report (JSON)",
    openEditor: "Open in Editor",
    returnToLab: "Return to Recognition Lab",
    approvePlan: "Approve Plan",
    approvedNotice: "Recognized plan approved",
    wallCount: "Walls",
    openingCount: "Openings",
    roomCount: "Rooms",
    furnitureCount: "Furniture",
    topologyStatus: "Topology Closed",
    serviceUnavailable: "CubiCasa recognition service is currently unavailable",
  },
  workflow: {
    steps: {
      plan: "Plan",
      room: "Room",
      furniture: "Furniture",
      decision: "Decision",
    },
    stepDescriptions: {
      plan: "Select & calibrate plan",
      room: "Select target room",
      furniture: "Add target furniture",
      decision: "Decision & fine-tune",
    },
    actions: {
      choosePlan: "Choose Standard Plan",
      changePlan: "Change Plan",
      calibrateDimensions: "Calibrate Room Spans",
      skipCalibration: "Skip calibration & continue to room",
      nextToRoom: "Next: Select Room",
      backToPlan: "Back to Plan",
      nextToFurniture: "Next: Add Furniture",
      backToRoom: "Back to Room",
      nextToDecision: "Next: View Decision",
      backToFurniture: "Back to Furniture",
      restartPlan: "Restart from Standard Template",
    },
    planStage: {
      title: "Plan Selection & Calibration",
      description: "Select a standard floor plan; optionally fine-tune room spans, or skip if the template is accurate.",
      currentPlanLabel: "Current Floor Plan",
      calibratePrompt: "Room Span Calibration (Optional)",
      accurateNotice: "Template is accurate enough, no calibration needed",
      stepTag: "Step 1/4",
    },
    roomStage: {
      title: "Select Target Room",
      description: "Choose the target room on canvas or from list for furniture fit testing.",
      placeholder: "Click a room on the canvas to set the evaluation space.",
      stepTag: "Step 2/4",
    },
    furnitureStage: {
      title: "Add & Configure Furniture",
      description: "Add a bed, sofa, or other target furniture to the room.",
      placeholder: "Select target furniture specification to test.",
      stepTag: "Step 3/4",
    },
    decisionStage: {
      title: "Space & Fit Decision",
      description: "Review fit verdict and clearance suggestions for the target furniture.",
      placeholder: "Fine-tune furniture dimensions, position, or rotation to re-evaluate fit in real time.",
      stepTag: "Step 4/4",
    },
  },
};

export const ROOM_TYPE_LABELS_ZH: Record<string, string> = {
  living_room: "客厅",
  bedroom: "卧室",
  master_bedroom: "主卧套房",
  kitchen: "厨房",
  bathroom: "卫生间",
  balcony: "阳台",
  dining_room: "餐厅",
  study: "书房",
  hallway: "玄关过道",
  storage: "储物间",
  other: "其他功能区",
};

export const ROOM_TYPE_LABELS_EN: Record<string, string> = {
  living_room: "Living Room",
  bedroom: "Bedroom",
  master_bedroom: "Master Suite",
  kitchen: "Kitchen",
  bathroom: "Bathroom",
  balcony: "Balcony",
  dining_room: "Dining Room",
  study: "Study",
  hallway: "Hallway",
  storage: "Storage",
  other: "Other",
};

export const FURNITURE_CATEGORY_LABELS_ZH: Record<string, string> = {
  all: "全部",
  bed: "床具",
  sofa: "沙发",
  table: "桌几",
  chair: "座椅",
  storage: "收纳储物",
  desk: "书桌工作台",
  tv_stand: "电视机柜",
  appliance: "家电设备",
  sanitary: "卫浴洁具",
  other: "其他",
};

export const FURNITURE_CATEGORY_LABELS_EN: Record<string, string> = {
  all: "All",
  bed: "Beds",
  sofa: "Sofas",
  table: "Tables",
  chair: "Chairs",
  storage: "Storage",
  desk: "Desks",
  tv_stand: "TV Stands",
  appliance: "Appliances",
  sanitary: "Sanitary",
  other: "Other",
};

export const FURNITURE_NAMES_ZH: Record<string, string> = {
  "bed-double": "双人床 (1.8m)",
  "bed-single": "单人床 (1.2m)",
  "sofa-3seat": "三人位沙发",
  "sofa-2seat": "双人位沙发",
  "armchair": "单人扶手椅",
  "dining-table-4": "四人餐桌",
  "dining-table-round": "圆形餐桌",
  "desk": "书桌工作台",
  "office-chair": "人体工学办公椅",
  "wardrobe-3door": "三门大衣柜",
  "wardrobe-2door": "双门衣柜",
  "tv-stand": "电视低柜",
  "coffee-table": "客厅茶几",
  "nightstand": "床头边几柜",
  "kitchen-island": "独立中岛操作台",
  "refrigerator": "双门冰箱",
  "washing-machine": "滚筒洗衣机",
  "bathroom-vanity": "一体浴室浴室柜",
  "toilet": "座便器马桶",
  "shower-enclosure": "干湿分离淋浴房",
  "bathtub": "独立浴缸",
};

export const PLAN_NAMES_ZH: Record<string, { name: string; description: string }> = {
  "floor-plan-std-studio-01": {
    name: "现代简约单身开间 (24m²)",
    description: "高效集约的单身开间公寓，起居睡眠一体化设计并配备独立干湿分离卫浴。",
  },
  "floor-plan-std-2b1l-01": {
    name: "北欧风舒适两室一厅 (65m²)",
    description: "功能均衡的两居室标准户型，动静分区明确，客厅与主卧采光充足。",
  },
  "floor-plan-std-3b1l-01": {
    name: "家庭型宽敞三室两厅 (110m²)",
    description: "南北通透的三居室家庭标准户型，包含独立主卧套房、多功能客餐厅与观景阳台。",
  },
};

export const PLAN_TAGS_ZH: Record<string, string> = {
  "Nordic": "北欧简约",
  "2-Room": "两居室",
  "Standard": "标准户型",
  "Studio": "开间",
  "Compact": "集约紧凑",
  "Open Plan": "开放布局",
  "Family": "品质家庭",
  "3-Room": "三居室",
  "Spacious": "宽敞通透",
  "Representative": "代表性户型",
  "1B1L": "一室一厅",
  "2B1L": "两室一厅",
  "2B2L": "两室两厅",
  "3B1L": "三室一厅",
  "3B2L": "三室两厅",
  "4B2L": "四室两厅",
  "5B2L": "五室两厅",
  "4B+": "四室及以上",
};

export function getFloorPlanLocale(requested?: string): FloorPlanLocale {
  if (!requested) {
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/zh")) {
      return "zh";
    }
    return "en";
  }
  return requested.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function getFloorPlanI18n(locale?: string) {
  const currentLocale = getFloorPlanLocale(locale);
  const dict = currentLocale === "zh" ? FLOOR_PLAN_ZH : FLOOR_PLAN_EN;

  return {
    locale: currentLocale,
    t: dict,
    getRoomTypeLabel(type: string) {
      if (currentLocale === "zh") {
        return ROOM_TYPE_LABELS_ZH[type] ?? type;
      }
      return ROOM_TYPE_LABELS_EN[type] ?? type;
    },
    getFurnitureCategoryLabel(category: string) {
      if (currentLocale === "zh") {
        return FURNITURE_CATEGORY_LABELS_ZH[category] ?? category;
      }
      return FURNITURE_CATEGORY_LABELS_EN[category] ?? category;
    },
    getFurnitureName(definitionId: string, fallbackName: string) {
      if (currentLocale === "zh" && FURNITURE_NAMES_ZH[definitionId]) {
        return FURNITURE_NAMES_ZH[definitionId];
      }
      return fallbackName;
    },
    getRuleTitle(ruleId: string, fallbackTitle: string) {
      if (currentLocale !== "zh") return fallbackTitle;
      switch (ruleId) {
        case "furniture-boundary":
        case "opening-boundary":
        case "wall-boundary":
          return dict.rules.titles.boundaryViolation;
        case "furniture-wall-collision":
          return dict.rules.titles.wallCollision;
        case "furniture-overlap":
          return dict.rules.titles.furnitureOverlap;
        case "opening-keep-clear":
          return dict.rules.titles.openingKeepClear;
        case "furniture-clearance":
          return dict.rules.titles.furnitureClearance;
        case "passage-clearance":
          return dict.rules.titles.passageClearance;
        default:
          return fallbackTitle;
      }
    },
    getRuleMessage(rule: RuleResult) {
      if (currentLocale !== "zh") return rule.message;
      const fName = rule.relatedEntityIds[0]
        ? FURNITURE_NAMES_ZH[rule.relatedEntityIds[0]] ?? rule.relatedEntityIds[0]
        : "";
      switch (rule.ruleId) {
        case "furniture-boundary":
          return `家具“${fName || rule.relatedEntityIds[0]}”超出房间边界范围，请将其移入封闭房间内。`;
        case "furniture-wall-collision":
          return `家具“${fName || rule.relatedEntityIds[0]}”与墙体结构发生重叠干涉，请适当挪移家具。`;
        case "furniture-overlap":
          return `家具之间发生空间重叠冲突，请调整家具位置或旋转方向。`;
        case "opening-keep-clear":
          return `家具阻挡了门窗洞口的通行与开启避让扇面，请保持通道畅通。`;
        case "furniture-clearance":
          return `家具前方活动使用净距不足规范建议值，可能造成通行拥堵。`;
        case "passage-clearance":
          return `室内主要交通动线通道净宽小于通行标准要求。`;
        default:
          return rule.message;
      }
    },
    formatRoomBreakdown(plan: StandardFloorPlan) {
      const counts: Record<string, number> = {};
      for (const r of plan.rooms) {
        counts[r.type] = (counts[r.type] ?? 0) + 1;
      }

      if (currentLocale === "zh") {
        const parts = Object.entries(counts).map(([type, count]) => {
          const label = ROOM_TYPE_LABELS_ZH[type] ?? type;
          return `${count} ${label}`;
        });
        return `${plan.rooms.length} 间功能区 (${parts.join("，")})`;
      }

      const parts = Object.entries(counts).map(([type, count]) => {
        const label = ROOM_TYPE_LABELS_EN[type] ?? type;
        return `${count} ${label.toLowerCase()}`;
      });
      return `${plan.rooms.length} ${plan.rooms.length === 1 ? "room" : "rooms"} (${parts.join(", ")})`;
    },
    getPlanName(id: string, fallbackName: string) {
      if (currentLocale === "zh" && PLAN_NAMES_ZH[id]) {
        return PLAN_NAMES_ZH[id].name;
      }
      return fallbackName;
    },
    getPlanDescription(id: string, fallbackDesc: string) {
      if (currentLocale === "zh" && PLAN_NAMES_ZH[id]) {
        return PLAN_NAMES_ZH[id].description;
      }
      return fallbackDesc;
    },
    getPlanTag(tag: string) {
      if (currentLocale === "zh" && PLAN_TAGS_ZH[tag]) {
        return PLAN_TAGS_ZH[tag];
      }
      return tag;
    },
  };
}

export function useFloorPlanI18n(localeProp?: string) {
  return React.useMemo(() => getFloorPlanI18n(localeProp), [localeProp]);
}
