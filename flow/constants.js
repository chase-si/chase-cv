// svg的基本长度单位
export const UNIT = 60
// desc占据的比例
export const RATIO = 4
// 双线的缝
export const SLIT = 5
// 字体大小
export const FONT = 10
// 背景填充色
export const FILL = '#ffffff'
// 激活的背景填充色
export const YELLOW_FILL = '#ffdc00'
// 为了添加小箭头, 后增的向右偏移量
export const ARROR_OFFSET = 30

// 节点type类型(流程图svg的基本节点类型)
export const NODE_TYPE = {
    start: {
        type: 'start',
        remark: '开始'
    },
    end: {
        type: 'end',
        remark: '结束'
    },
    step: {
        type: 'step',
        remark: '普通step'
    },
    transfer: {
        type: 'transfer',
        remark: '转化'
    },
    seq: {
        type: 'seq',
        remark: '序列'
    },
    cond: {
        type: 'cond',
        remark: '条件分支, 多seq的横向排布的结构'
    },
    para: {
        type: 'para',
        remark: '并行'
    }
}

// 选择的节点数据类型
export const DATA_TYPES = {
    Recipe: 'recipe',
    Unit: 'unit',
    Operation: 'operation',
    Phase: 'phase'
}

// 流程图操作
export const OPERATE_TYPE = {
    放大: 'enlarge',
    缩小: 'shrink',
    正常: 'normalise'
}
// 流程图状态
export const FLOW_STATUS = {
    新增: 'add',
    编辑: 'edit',
    只读: 'readonly'
}

// -----------------------测试用的demo数据--------------
export const DEMO_DATA_STEP = [
    { type: 'step' }
]

// 基础
export const DEMO_DATA_BASIC_FLOW = [
    { type: 'start', start: true },
    { type: 'transfer', expr: 'transfer' },
    { type: 'end' }
]

// 多步骤
export const DEMO_DATA_BASIC_FLOW1 = [
    { type: 'start' },
    [
        { type: 'step', text: '001', descStr: 'desc1' },
        { type: 'step', text: '002', descStr: 'desc2' },
        [
            { type: 'step', text: '005', descStr: 'desc5' },
            { type: 'step', text: '006', descStr: 'desc6' }
        ]
    ],
    { type: 'end' }
]

// 并行
// 为什么会有单层的数组和双层的数组结构?双层数组结构就是两个分支或者多个分支,
// 正确的内容,都得加双层数组内容,因为需要多个分支内容
export const DEMO_DATA_PARA = [
    { type: 'start' },
    {
        type: 'para',
        steps: [
            [
                { type: 'step', text: '001', descStr: 'desc1' },
                { type: 'step', text: '002', descStr: 'desc2' }
            ],
            { type: 'step', text: '004', descStr: 'desc4' }
        ]
    },
    { type: 'step', text: '005', descStr: 'desc5' },
    { type: 'step', text: '006', descStr: 'desc6' },
    { type: 'end' }
]

// 条件
export const DEMO_DATA_COND = [
    { type: 'start' },
    { type: 'transfer', expr: true },
    { type: 'step', text: '001', descStr: 'desc1' },
    {
        type: 'cond',
        steps: [
            [
                { type: 'transfer', expr: 'step01.finished=true' },
                { type: 'step', text: '002', descStr: 'desc2' },
                { type: 'transfer', expr: 'true' }
            ],
            [
                { type: 'transfer', expr: 'step01.finished=false' },
                { type: 'step', text: '003', descStr: 'desc3' },
                { type: 'transfer', jump: true, expr: '001' }
            ]
        ]
    },
    { type: 'end' }
]

// 多条件
export const DEMO_DATA_CONDS = [
    {
        type: 'cond',
        steps: [
            [
                { type: 'transfer' },
                { type: 'step', text: '001', descStr: 'desc1' },
                { type: 'transfer' }
            ],
            [
                { type: 'transfer' },
                { type: 'step', text: '001', descStr: 'desc1' }
            ],
            [
                { type: 'step', text: '005', descStr: 'desc5' },
                { type: 'step', text: '006', descStr: 'desc6' }
            ]
        ]
    }
]

// 完整例子
export const DEMO_DATA_EXAMPLE = [
    {
        type: 'start', id: 'start-step', text: 'start', descStr: '开始', start: true, status: 'finished'
    },
    {
        type: 'transfer', id: 'transfer001', expr: 'true', status: 'ready'
    },
    {
        type: 'step', id: 'step001', text: '001', descStr: 'desc1', status: 'ready', params: { duration: 3 }
    },
    {
        type: 'transfer', id: 'transfer002', expr: 'true', status: 'ready'
    },
    {
        type: 'step', id: 'step002', text: '002', descStr: 'desc2', status: 'ready', params: { duration: 3 }
    },
    {
        type: 'transfer', id: 'transfer003', expr: 'true', status: 'ready'
    },
    {
        type: 'step', id: 'step003', text: '003', descStr: 'desc3', status: 'ready', params: { duration: 3 }
    },
    {
        type: 'transfer', id: 'transfer004', expr: 'true', status: 'ready'
    },
    {
        type: 'cond',
        id: 'cond1',
        status: 'ready',
        steps: [
            [
                {
                    type: 'transfer', id: 'transfer005', expr: 'true', status: 'ready'
                },
                {
                    type: 'step', id: 'step004', text: '004', descStr: 'desc4', status: 'ready', params: { duration: 3 }
                }
            ],
            [
                {
                    type: 'transfer', id: 'transfer007', expr: 'false', status: 'ready'
                },
                {
                    type: 'step', id: 'step005', text: '005', descStr: 'desc5', status: 'ready'
                },
                {
                    type: 'transfer', id: 'transfer-jump', jump: true, expr: '001'
                }
            ]
        ]
    },
    {
        type: 'step', id: 'step006', text: '006', descStr: 'desc6', status: 'ready', params: { duration: 3 }
    },
    {
        type: 'transfer', id: 'transfer008', expr: 'true', status: 'ready'
    },
    {
        type: 'para',
        id: 'para1',
        status: 'ready',
        steps: [
            [
                {
                    type: 'step', id: 'step007', text: '007', descStr: 'desc7', status: 'ready', params: { duration: 1 }
                }
            ],
            [
                {
                    type: 'step', id: 'step008', text: '008', descStr: 'desc8', status: 'ready', params: { duration: 2 }
                }
            ],
            [
                {
                    type: 'step', id: 'step009', text: '009', descStr: 'desc9', status: 'ready', params: { duration: 3 }
                },
                {
                    type: 'step', id: 'step010', text: '010', descStr: 'desc10', status: 'ready', params: { duration: 3 }
                },
                {
                    type: 'step', id: 'step011', text: '011', descStr: 'desc11', status: 'ready', params: { duration: 3 }
                },
                {
                    type: 'step', id: 'step012', text: '012', descStr: 'desc12', status: 'ready', params: { duration: 3 }
                }
            ]
        ]
    },
    {
        type: 'transfer', id: 'transfer009', expr: 'true', status: 'ready'
    },
    { type: 'end', id: 'end-step' }
]
// 转换条件的运行状态
export const runningStatus = [
    {
        label: '空闲',
        value: 0
    },
    {
        label: '运行',
        value: 1
    },
    {
        label: '暂停中',
        value: 2
    },
    {
        label: '恢复运行中',
        value: 3
    },
    {
        label: '停止中',
        value: 4
    },
    {
        label: '已暂停',
        value: 5
    },
    {
        label: '已放弃',
        value: 6
    },
    {
        label: '跳步状态',
        value: 7
    },
    {
        label: '已完成',
        value: 8
    },
    {
        label: '放弃中',
        value: 9
    },
    {
        label: '已停止',
        value: 10
    },
    {
        label: '保持中',
        value: 11
    },
    {
        label: '已保持',
        value: 12
    },
    {
        label: '重启中',
        value: 13
    }

]
