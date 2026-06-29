export type FlowUiCopy = {
  title: string;
  description: string;
  toolbarAria: string;
  canvasAria: string;
  propertiesAria: string;
  demo: {
    dirty: string;
    reset: string;
    runningHighlight: string;
  };
  toolbar: {
    title: string;
    zoomHeading: string;
    zoomOut: string;
    zoomIn: string;
    zoomReset: string;
    nodeActions: string;
    selected: string;
    selectionHint: string;
    selectAlert: string;
    addStep: string;
    addBranch: string;
    expandBranch: string;
    deleteNode: string;
  };
  properties: {
    title: string;
    description: string;
    emptyTitle: string;
    emptyDescription: string;
    cancelSelection: string;
    id: string;
    number: string;
    descriptionLabel: string;
    expression: string;
    type: string;
    branchCount: string;
    conditionNode: string;
    parallelNode: string;
    endNode: string;
    structuralHelp: string;
    structuralReadonly: string;
  };
  feedback: {
    selectNode: string;
    zoomMax: string;
    zoomMin: string;
    addStepError: string;
    addBranchError: string;
    expandBranchError: string;
    deleteError: string;
  };
  dialog: {
    deleteTitle: string;
    resetTitle: string;
    deleteDescription: string;
    resetDescription: string;
    confirmDelete: string;
    confirmReset: string;
  };
};

export const defaultFlowUiCopy: FlowUiCopy = {
  title: "流程编辑器",
  description:
    "查看并编辑 SFC 流程结构的可视化草稿；使用左侧工具栏缩放画布并增删分支与顺序步。",
  toolbarAria: "流程编辑器工具栏",
  canvasAria: "流程图画布",
  propertiesAria: "节点属性",
  demo: {
    dirty: "已修改",
    reset: "重置示例",
    runningHighlight: "运行态高亮",
  },
  toolbar: {
    title: "编辑工具",
    zoomHeading: "画布缩放",
    zoomOut: "缩小",
    zoomIn: "放大",
    zoomReset: "重置为 100%",
    nodeActions: "节点操作",
    selected: "已选：{id}",
    selectionHint: "选择节点后进行编辑",
    selectAlert: "请先在画布中选择节点",
    addStep: "增加顺序步",
    addBranch: "增加分支",
    expandBranch: "扩展分支",
    deleteNode: "删除节点",
  },
  properties: {
    title: "属性",
    description: "选中节点后在此编辑参数",
    emptyTitle: "尚未选中节点",
    emptyDescription: "在画布中选择节点后，可在这里查看和编辑属性。",
    cancelSelection: "取消选择",
    id: "ID",
    number: "编号",
    descriptionLabel: "描述",
    expression: "条件表达式",
    type: "类型",
    branchCount: "分支数",
    conditionNode: "条件节点",
    parallelNode: "并行节点",
    endNode: "结束节点",
    structuralHelp:
      "在画布中选中该节点后，可使用工具栏「扩展分支」查看并编辑各分支内的子节点。",
    structuralReadonly: "此节点为结构节点，属性只读。",
  },
  feedback: {
    selectNode: "请先在流程图中选中一个节点",
    zoomMax: "已达到最大缩放 200%",
    zoomMin: "已达到最小缩放 50%",
    addStepError: "增加顺序步失败",
    addBranchError: "增加分支失败",
    expandBranchError: "扩展分支失败",
    deleteError: "当前节点不可删除",
  },
  dialog: {
    deleteTitle: "删除所选节点？",
    resetTitle: "重置示例？",
    deleteDescription: "节点 {id} 将从流程中移除，此操作无法撤销。",
    resetDescription:
      "当前流程包含尚未保留的修改。重置后将恢复示例内容，此操作无法撤销。",
    confirmDelete: "确认删除",
    confirmReset: "确认重置",
  },
};

export function interpolateFlowCopy(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}
