import { v4 as uuidv4 } from 'uuid'
import { numToChar } from './numToChar'
import { DATA_TYPES, NODE_TYPE } from './constants'
// 本文件存放纯函数

/**
 * 递归添加步骤到树形数据中的指定位置
 * @unitest ../__test/utils.test.js
 * @param {Object} options - 选项对象
 * @param {Array} options.wholeTreeData - 整个树形数据
 * @param {Object} options.newStepData - 要添加的新步骤数据
 * @param {string} options.incertAfterId - 插入位置的步骤ID
 * @returns {Array} - 添加新步骤后的树形数据
 */
export const recursiveToAddStep = ({
    wholeTreeData,
    newStepData,
    incertAfterId
}) => {
    const cpData = [...wholeTreeData]
    const positionIdx = cpData.findIndex(treeData => treeData.id === incertAfterId)

    if (positionIdx !== -1) {
        cpData.splice(positionIdx + 1, 0, newStepData)
        return cpData
    }

    return cpData.map(treeData => {
        // 参见 unitest 中 should return added result3, steps为双层嵌套array
        if (Array.isArray(treeData)) {
            return recursiveToAddStep({
                wholeTreeData: treeData,
                newStepData,
                incertAfterId
            })
        }

        if (treeData.steps) {
            return {
                ...treeData,
                steps: recursiveToAddStep({
                    wholeTreeData: treeData.steps,
                    newStepData,
                    incertAfterId
                })
            }
        }
        return treeData
    })
}

/**
 * @description 递归删除节点
 * @unitest '../__test/utils.test.js'
 * @param {Object} options - 选项对象
 * @param {Array} options.wholeTreeData - 整个树形数据
 * @param {string} options.deteleTargetId - 要删除的目标节点的ID
 * @returns {Array} - 删除节点后的树形数据
 */
export const recursiveToDeleteNode = ({
    wholeTreeData,
    deleteId
}) => {
    const cpData = [...wholeTreeData]
    const positionIdx = cpData.findIndex(treeData => treeData.id === deleteId)

    if (positionIdx !== -1) {
        cpData.splice(positionIdx, 1)
        return cpData
    }

    return cpData.map(treeData => {
        if (Array.isArray(treeData)) {
            return recursiveToDeleteNode({
                wholeTreeData: treeData,
                deleteId
            })
        }

        if (treeData.steps) {
            return {
                ...treeData,
                steps: recursiveToDeleteNode({
                    wholeTreeData: treeData.steps,
                    deleteId
                })
            }
        }
        return treeData
    })
}

/**
 * @description 递归删除空数组的工具函数
 * @unitest '../__test/utils.test.js'
 * @param {Array} wholeTreeData - 整个树形数据
 * @returns {Array} - 删除空数组后的树形数据
 */
export const recursiveToDeleteEmptyArr = (wholeTreeData) => {
    const cpData = [...wholeTreeData]
        .filter(treeData => (JSON.stringify(treeData) !== '[]') && (JSON.stringify(treeData) !== '[[]]'))

    return cpData.map(treeData => {
        if (Array.isArray(treeData)) {
            return recursiveToDeleteEmptyArr(treeData)
        }

        if (treeData.steps) {
            return {
                ...treeData,
                steps: recursiveToDeleteEmptyArr(treeData.steps)
            }
        }
        return treeData
    })
}

/**
 * @description 递归查找steps只有一个item的数据
 * @param {*} wholeTreeData
 * @returns
 */
export const recursiveToFindOneStepData = (wholeTreeData) => {
    const cpData = [...wholeTreeData]
    let targetData

    cpData.forEach(treeData => {
        if (targetData) {
            return
        }
        // 参见 unitest 中 should return added result3, steps为双层嵌套array
        if (Array.isArray(treeData)) {
            targetData = recursiveToFindOneStepData(treeData)
        }
        if (targetData) {
            return
        }
        if (treeData.steps) {
            if (treeData.steps.length === 1) {
                targetData = treeData
            } else {
                targetData = recursiveToFindOneStepData(treeData.steps)
            }
        }
    })

    return targetData
}

/**
 * @description 递归给条件/并行节点添加步骤
 * @param {Object} options - The options for recursive expansion.
 * @param {Array} options.wholeTreeData - The whole tree data to be expanded.
 * @param {Object} options.newData - The new data to be inserted.
 * @param {string} options.incertDataId - The ID where the new data should be inserted.
 * @returns {Array} - The new expanded tree data.
 */
export const recursiveToExpandSteps = ({
    wholeTreeData,
    newData,
    incertDataId
}) => {
    const cpData = [...wholeTreeData]

    return cpData.map(treeData => {
        if (treeData.id === incertDataId) {
            return {
                ...treeData,
                steps: [...treeData.steps, newData]
            }
        }

        if (Array.isArray(treeData)) {
            return recursiveToExpandSteps({
                wholeTreeData: treeData,
                newData,
                incertDataId
            })
        }

        if (treeData.steps) {
            return {
                ...treeData,
                steps: recursiveToExpandSteps({
                    wholeTreeData: treeData.steps,
                    newData,
                    incertDataId
                })
            }
        }
        return treeData
    })
}

/**
 * 递归大神的数据结构查找节点的工具函数
 * @unitest ../__test/utils.test.js
 * @param {Object} options - 选项对象
 * @param {Array} options.wholeTreeData - 整个树形数据
 * @param {string} options.id - 目标节点的ID
 * @returns {Object|undefined} - 目标节点的数据，如果未找到则返回undefined
 */
export const recursiveToFindNode = ({
    wholeTreeData,
    id
}) => {
    const cpData = [...wholeTreeData]
    let targetIdData = cpData.find(treeData => treeData.id === id)

    if (targetIdData) {
        return targetIdData
    }

    cpData.forEach(treeData => {
        if (targetIdData) {
            return
        }

        if (Array.isArray(treeData)) {
            targetIdData = recursiveToFindNode({
                wholeTreeData: treeData,
                id
            })
        }
        if (targetIdData) {
            return
        }

        if (treeData.steps) {
            targetIdData = recursiveToFindNode({
                wholeTreeData: treeData.steps,
                id
            })
        }
    })

    return targetIdData
}

/**
 * @description 递归找到id节点的父级
 * @unitest ../__test/utils.test.js
 * @param {*} props.wholeTreeData 递归的数据
 * @param {*} props.id 目标节点id
 * @returns
 */
export const recursiveToFindNodeParent = ({
    wholeTreeData,
    id
}) => {
    const cpData = [...wholeTreeData]
    const targetIdData = cpData.find(treeData => treeData.id === id)
    let parentNodes

    if (targetIdData) {
        parentNodes = cpData
        return parentNodes
    }

    cpData.forEach(treeData => {
        if (parentNodes) {
            return
        }
        // 参见 unitest 中 should return added result3, steps为双层嵌套array
        if (Array.isArray(treeData)) {
            parentNodes = recursiveToFindNodeParent({
                wholeTreeData: treeData,
                id
            })
        }
        if (parentNodes) {
            return
        }
        if (treeData.steps) {
            parentNodes = recursiveToFindNodeParent({
                wholeTreeData: treeData.steps,
                id
            })
        }
    })

    return parentNodes
}

/**
 * 递归大神的数据结构(svg的json结构), 给某个节点更新or新增属性
 * @unitest ../__test/utils.test.js
 * @param {Object} options - 选项对象
 * @param {Array} options.wholeTreeData - 整个树形数据
 * @param {string} options.id - 目标节点的ID
 * @param {Object} options.attrsObj - 要更新的属性们 {name: "haha", age: 18}
 * @returns {Object|undefined} - 目标节点的数据，如果未找到则返回undefined
 */
export const recursiveToUpdateNode = ({
    wholeTreeData,
    id,
    attrsObj
}) => {
    const cpData = [...wholeTreeData]

    return cpData.map(treeData => {
        if (treeData.id === id) {
            return {
                ...treeData,
                ...attrsObj
            }
        }

        if (Array.isArray(treeData)) {
            return recursiveToUpdateNode({
                wholeTreeData: treeData,
                id,
                attrsObj
            })
        }

        if (treeData.steps) {
            return {
                ...treeData,
                steps: recursiveToUpdateNode({
                    wholeTreeData: treeData.steps,
                    id,
                    attrsObj
                })
            }
        }
        return treeData
    })
}

/**
 * @description 遍历左侧的树形数据, 找到对应的节点
 * @param {Object} options - The options for finding the node.
 * @param {Array} options.treeData - The tree data to search in.
 * @param {string} options.nodeId - The ID of the node to find.
 * @returns {Object|null} - The found node or null if not found.
 */
export const recursiveTreeDataFindNode = ({
    treeData,
    nodeId
}) => {
    for (let i = 0; i < treeData.length; i += 1) {
        if (treeData[i].id_node === nodeId) {
            return treeData[i]
        } if (treeData[i].children) {
            const found = recursiveTreeDataFindNode({
                treeData: treeData[i].children,
                nodeId
            })
            if (found) {
                return found
            }
        }
    }
    return null
}

/**
 * flatten 深度递归flatten树状结构
 * @unitest ../__test/utils.test.js
 * @param {Array} data - The flow data to be flattened.
 * @param {string} parentId - The parent ID to be assigned to each item.
 * @returns {Array} - The flattened flow data.
 */
export const flattenFlowData = (data) => {
    const result = []

    const flatten = (arr) => {
        for (let i = 0; i < arr.length; i += 1) {
            const item = arr[i]
            const newItem = { ...item }

            if (item.steps) {
                delete newItem.steps
                result.push(newItem)
                flatten(item.steps.flat())
            } else {
                result.push(newItem)
            }
        }
    }

    flatten(data)

    return result
}

/**
 * @description 将数据转换为antd树形数据, 添加激活状态
 * @unitest ../__test/utils.test.js
 * @param {Object} options - The options object.
 * @param {Array} options.treeData - The array of tree data.
 * @param {string} options.activeIdA - The active ID A.
 * @param {string} options.activeIdB - The active ID B.
 * @returns {Array} The converted tree data with additional properties.
 */
export const handleDataToTreeData = ({
    treeData,
    activeIdA,
    activeIdB
}) => {
    if (!Array.isArray(treeData)) {
        return []
    }
    return treeData.map(item => {
        const {
            children, node_type, id_node, id_node_parent, node_name
        } = item
        const activeA = activeIdA === id_node
        return {
            key: id_node,
            title: node_name,
            // 深蓝色的激活节点
            activeA,
            // 浅蓝色的激活节点(当也是activeA时, 不需要显示)
            activeB: !activeA && (activeIdB === id_node),
            id_node_parent,
            id_node,
            node_type,
            children: handleDataToTreeData({
                treeData: children,
                activeIdA,
                activeIdB
            })
        }
    })
}

/**
 * @description 随机生成一个新的步骤数据
 * @param {*} randomId
 * @returns newStepData
 */
const getNewStepData = (randomId) => {
    return ({
        type: 'step',
        id: randomId || uuidv4(),
        text: '',
        descStr: '',
        instance_name: '',
        instance_id: ''
    })
}

/**
 * @description 返回点击添加顺序步之后的新svg的渲染数据
 * @unitest ../__test/utils.test.js
 * @param {Object} options - The options for adding a step.
 * @param {Object} options.renderData - The data of the entire recipe flow.
 * @param {string} options.activeId - The ID of the currently active step.
 * @returns {Object} - The updated data of the recipe flow and the newly added steps.
 * @returns {Array} newFlowData - The updated data of the recipe flow.
 * @returns {Array} newAddedSteps - The newly added steps.
 */
export const handleClickAddStep = ({
    renderData,
    activeId
}) => {
    // 一次添加要添加一个step和一个transfer
    const selectedData = recursiveToFindNode({
        wholeTreeData: renderData,
        id: activeId
    })
    const randomStepId = uuidv4()

    if (selectedData?.type === NODE_TYPE.transfer.type) {
        const newStepData = getNewStepData(randomStepId)

        // 先加小框块, 再加小横线
        const dataAddedStep = recursiveToAddStep({
            wholeTreeData: renderData,
            newStepData,
            incertAfterId: activeId
        })

        const dataAddedTrans = recursiveToAddStep({
            wholeTreeData: dataAddedStep,
            newStepData: {
                type: 'transfer',
                id: uuidv4(),
                text: '',
                expr: '',
                status: 'ready'
            },
            incertAfterId: randomStepId
        })
        return {
            newFlowData: dataAddedTrans,
            newAddedSteps: [newStepData]
        }
    }

    // 先加小横线, 再加小框块
    const dataAddedTrans = recursiveToAddStep({
        wholeTreeData: renderData,
        newStepData: {
            type: 'transfer',
            id: randomStepId,
            text: '',
            expr: '',
            status: 'ready'
        },
        incertAfterId: activeId
    })

    const newStepData = getNewStepData()
    const dataAddedStep = recursiveToAddStep({
        wholeTreeData: dataAddedTrans,
        newStepData,
        incertAfterId: randomStepId
    })

    return {
        newFlowData: dataAddedStep,
        newAddedSteps: [newStepData]
    }
}

/**
 * @description 返回点击添加分支后的新svg的渲染数据和新增的step节点
 * @unitest ../__test/utils.test.js
 * @param {Object} options - The options for adding a branch.
 * @param {Array} options.renderData - The data representing the entire tree structure.
 * @param {string} options.activeId - The ID of the currently active node.
 * @returns {Array} newFlowData - The updated data of the recipe flow.
 * @returns {Array} newAddedSteps - The newly added steps.
 */
export const handleClickAddBranch = ({
    renderData,
    activeId
}) => {
    const selectedData = recursiveToFindNode({
        wholeTreeData: renderData,
        id: activeId
    })
    const newAddedSteps = []

    // 先加一个条件, 条件内自带一个tranfer
    // 再加一个step
    // step有一个双层的数组内容,需要后续补充为啥实现这种结构,最早的demo例子中就会出现这种情况,调度上是否有特殊的处理?
    if (selectedData?.type === NODE_TYPE.step.type) {
        const newCondId = uuidv4()

        const addedCondData = recursiveToAddStep({
            wholeTreeData: renderData,
            newStepData: {
                type: 'cond',
                id: newCondId,
                status: 'ready',
                steps: [[{
                    type: 'transfer',
                    text: '',
                    expr: '',
                    id: uuidv4()
                }], [{
                    type: 'transfer',
                    text: '',
                    expr: '',
                    // jump: true,
                    id: uuidv4()
                }]]
            },
            incertAfterId: activeId
        })

        const stepId = uuidv4()
        const newStepData = getNewStepData(stepId)
        const addedStepData = recursiveToAddStep({
            wholeTreeData: addedCondData,
            newStepData,
            incertAfterId: newCondId
        })
        newAddedSteps.push(newStepData)

        return {
            newFlowData: addedStepData,
            newAddedSteps
        }
    }

    // 先加一个并行, 条件内自带一个step
    // 再加一个transfer
    if (selectedData?.type === NODE_TYPE.transfer.type) {
        const newParaId = uuidv4()
        const newStepId1 = uuidv4()
        const newStepId2 = uuidv4()
        const newStepData1 = getNewStepData(newStepId1)
        const newStepData2 = getNewStepData(newStepId2)
        newAddedSteps.push(newStepData1, newStepData2)

        const addedParaData = recursiveToAddStep({
            wholeTreeData: renderData,
            newStepData: {
                type: 'para',
                id: newParaId,
                status: 'ready',
                steps: [[newStepData1], [newStepData2]]
            },
            incertAfterId: activeId
        })

        const newTranId = uuidv4()
        const addedTranData = recursiveToAddStep({
            wholeTreeData: addedParaData,
            newStepData: {
                type: 'transfer',
                id: newTranId,
                text: '',
                expr: ''
            },
            incertAfterId: newParaId
        })
        return {
            newFlowData: addedTranData,
            newAddedSteps
        }
    }

    return {
        newFlowData: renderData,
        newAddedSteps
    }
}

/**
 * @description 返回点击扩展分支后的新svg的渲染数据
 * @unitest ../__test/utils.test.js
 * @param {Object} options - 选项对象
 * @param {Array} options.renderData - 渲染数据
 * @param {string} options.activeId - 激活的节点ID
 * @returns {Array} newFlowData - 更新后的渲染数据
 * @returns {Array} newAddedSteps - The newly added steps.
 */
export const handleClickExpandBranch = ({
    renderData,
    activeId
}) => {
    const selectedData = recursiveToFindNode({
        wholeTreeData: renderData,
        id: activeId
    })
    const newAddedSteps = []

    // 条件类型直接加一个带空transfer的分支
    if (selectedData?.type === NODE_TYPE.cond.type) {
        const newTransId = uuidv4()
        const addedStepData = recursiveToExpandSteps({
            wholeTreeData: renderData,
            newData: [{
                type: 'transfer',
                id: newTransId,
                text: '',
                expr: ''
            }],
            incertDataId: activeId
        })
        return {
            newFlowData: addedStepData,
            newAddedSteps
        }
    }

    // 并行类型直接加一个带空step的分支
    if (selectedData?.type === NODE_TYPE.para.type) {
        const newStepId = uuidv4()
        const newStepData = getNewStepData(newStepId)
        newAddedSteps.push(newStepData)

        const addedTranData = recursiveToExpandSteps({
            wholeTreeData: renderData,
            newData: [newStepData],
            incertDataId: activeId
        })
        return {
            newFlowData: addedTranData,
            newAddedSteps
        }
    }

    return {
        newFlowData: renderData,
        newAddedSteps
    }
}

/**
 * @description 1.过滤空数组, 2.把只有一个steps数组转换为单分支
 * @unitest todo
 * @param {*} data
 * @returns
 */
export const transfromSingleStepData = (data) => {
    // console.log('transfromSingleStepData data', data)
    // 过滤空数组
    let newData = recursiveToDeleteEmptyArr(data)
    // console.log('data filter empty arr', newData)
    // 找到steps只有一个元素的数据
    const oneStepsItem = recursiveToFindOneStepData(newData)
    // console.log('oneStepsItem', oneStepsItem)
    // 把steps只有一个元素的数组转换为单个step或transfer
    if (oneStepsItem) {
        const { steps, id } = oneStepsItem
        const stepsChildArr = steps.flat()
        stepsChildArr.reverse().forEach(item => {
            newData = recursiveToAddStep({
                wholeTreeData: newData,
                newStepData: item,
                incertAfterId: id
            })
        })
        newData = recursiveToDeleteNode({
            wholeTreeData: newData,
            deleteId: id
        })
    }

    return newData
}

/**
 * @description 返回点击扩展分支后的新svg的渲染数据
 * @unitest todo ../__test/utils.test.js
 * @param {Object} options - 选项对象
 * @param {Array} options.renderData - 渲染数据
 * @param {string} options.activeId - 激活的节点ID
 * @returns {Array} newFlowData - 更新后的渲染数据
 * @returns {Array} deletedSteps - 批量删除的steps.
 */
export const handleClickDelete = ({
    renderData,
    activeId
}) => {
    const selectedData = recursiveToFindNode({
        wholeTreeData: renderData,
        id: activeId
    })
    const deletedItems = []

    if (selectedData.type === NODE_TYPE.transfer.type) {
        const parentNodes = recursiveToFindNodeParent({
            wholeTreeData: renderData,
            id: selectedData.id
        })
        console.log('parentNodes', parentNodes)
        // 当前transfer是条件分支的唯一元素, 允许删除
        if (parentNodes.length === 1) {
            console.log('删除了transfer')
            deletedItems.push(selectedData)
            let newFlowData = recursiveToDeleteNode({
                wholeTreeData: renderData,
                deleteId: selectedData.id
            })
            newFlowData = transfromSingleStepData(newFlowData)

            return {
                newFlowData,
                deletedItems
            }
        }
        throw new Error('当前transfer不可删除')
    }

    // 删除step
    if (selectedData.type === NODE_TYPE.step.type) {
        const parentNodes = recursiveToFindNodeParent({
            wholeTreeData: renderData,
            id: selectedData.id
        })
        // 当前step是并行分支的唯一元素, 允许删除
        if (parentNodes.length === 1) {
            console.log('删除了并行分支下的唯一step')
            deletedItems.push(selectedData)
            let newFlowData = recursiveToDeleteNode({
                wholeTreeData: renderData,
                deleteId: selectedData.id
            })
            // todo 可能面临transfer重新绑定的问题
            newFlowData = transfromSingleStepData(newFlowData)

            return {
                newFlowData,
                deletedItems
            }
        }

        // step后面跟着一个transfer, 允许删除, 且把transfer一起删掉
        const stepNextNode = parentNodes[
            parentNodes.findIndex(item => item.id === selectedData.id) + 1
        ]
        console.log('stepNextNode', stepNextNode)
        if (stepNextNode?.type === NODE_TYPE.transfer.type) {
            deletedItems.push(selectedData, stepNextNode)
            let newFlowData = recursiveToDeleteNode({
                wholeTreeData: renderData,
                deleteId: selectedData.id
            })
            newFlowData = recursiveToDeleteNode({
                wholeTreeData: newFlowData,
                deleteId: stepNextNode.id
            })
            return {
                newFlowData,
                deletedItems
            }
        }

        // todo 内在逻辑不清楚, 可能其他的允许 删除step的情况
        throw new Error('当前step不可删除')
    }

    throw new Error('当前节点不可删除')
}

// 创建一个默认的流程图数据, 当前的nodeId直接放在开始步骤里
export const createDefaultFlowData = ({
    nodeId,
    initTransferId
}) => {
    return [{
        type: 'start',
        text: 'start',
        descStr: '开始',
        id: nodeId
    }, {
        type: 'transfer',
        id: initTransferId,
        text: '',
        expr: ''
    }, {
        type: 'end'
    }]
}

/**
 * @description 根据当前flow已经存在的子节点个数, 返回新的子节点字母序号
 * @param {*} name
 */
export const getNewNameChar = ({
    flowData,
    filterType = NODE_TYPE.step.type
}) => {
    const flattenFlowDataArr = flattenFlowData(flowData)
        .filter(item => item.type === filterType)
    return numToChar(flattenFlowDataArr.length)
}

/**
 * @description 处理提交数据的函数
 * @unitest '../__test/utilsPostData.test.js'
 * @param {Object} params - 参数对象
 * @param {string} params.recipeId - 当前编辑的流程图,配方ID
 * nubmer类型 (顶层节点, 唯一) - 对应后端 sfc_flow 和 recipe表里的 id_recipe
 * @param {string} params.nodeId - 当前节点的 NodeID
 * 可能是Recipe, Operate, Unit的nodeId - 对应后端sfc_flow表里的id_node
 * @param {string} params.nodeType - 节点类型
 * DATA_TYPES.Recipe, DATA_TYPES.Operate, DATA_TYPES.Unit
 * @param {string} params.nodeParent - 节点的父级ID
 * @param {Array} params.newFlowData - 新的svg流程图数据
 * @param {Array} params.newChildrenNodes - 新的子节点数据
 * @param {Object} params.flowExit - 当前流程图存不存在
 * 为后端 sfc_flow的某一条数据或者为null
 * @returns {Object} - 返回编辑参数和子节点数据
 */
export const handlePostDatas = (params) => {
    const {
        recipeId,
        nodeId,
        nodeType,
        nodeParent,
        newFlowData,
        newChildrenNodes,
        flowExit
    } = params
    // console.log('handlePostDatas params', params)
    const dataTypesArr = Object.values(DATA_TYPES)
    const childNodeType = dataTypesArr[dataTypesArr.findIndex(item => item === nodeType) + 1]
    // 计算当前子节点的index起始位置
    const currentFlowData = flowExit ? JSON.parse(flowExit.flow_json) : []
    const childStepsNodeConut = flattenFlowData(currentFlowData)
        .filter(item => item.type === NODE_TYPE.step.type).length

    // console.log('newChildrenNodes', newChildrenNodes)
    const postChildrenNodes = newChildrenNodes.map((node, index) => ({
        node_type: childNodeType,
        id_node: node.id,
        node_name: `${childNodeType.substring(0, 1).toLocaleUpperCase()}_${numToChar(index + childStepsNodeConut)}`,
        node_sort: 100,
        id_recipe: recipeId,
        id_node_parent: nodeId,
        flow_json: JSON.stringify(createDefaultFlowData({
            nodeId: node.id,
            initTransferId: uuidv4()
        }))
    }))

    if (!flowExit) {
        // 初始化db里的Recipe层级的数据
        if (nodeType === DATA_TYPES.Recipe) {
            return {
                editParam: {
                    data: [{
                        node_type: DATA_TYPES.Recipe,
                        id_node: nodeId,
                        node_name: 'R_A',
                        node_sort: 0,
                        id_recipe: recipeId,
                        id_node_parent: null,
                        flow_json: JSON.stringify(newFlowData)
                    }]
                },
                postChildrenNodes
            }
        }
        // 初始化db里的非Recipe层级的数据
        return {
            editParam: {
                data: [{
                    node_type: nodeType,
                    id_node: nodeId,
                    node_name: 'R_A',
                    node_sort: 0,
                    id_recipe: recipeId,
                    id_node_parent: nodeParent,
                    flow_json: JSON.stringify(newFlowData)
                }]
            },
            postChildrenNodes
        }
    }
    // 更新db里的flow数据以及新建子节点
    return {
        editParam: {
            id_sfc_flow: flowExit.id_sfc_flow,
            node_type: nodeType,
            flow_json: JSON.stringify(newFlowData)
        },
        postChildrenNodes
    }
}

export const handleTabNames = (activeNodeType) => {
    if (activeNodeType === DATA_TYPES.Unit) {
        return ['Unit程序SFC', 'Operate程序列表']
    }
    if (activeNodeType === DATA_TYPES.Operate) {
        return ['Operate程序SFC', 'Phase程序列表']
    }
    return ['Recipe程序SFC', 'Unit程序列表']
}

// siderbar的状态控制reducer, 后期可看情况提到redux
export const iconDisabledReducer = (state, action) => {
    switch (action.type) {
    case 'allowAddStep':
        return {
            ...state,
            allowAddStep: true
        }
    case 'disabledAddStep':
        return {
            ...state,
            allowAddStep: false
        }
    case 'allowAddBranch':
        return {
            ...state,
            allowAddBranch: true
        }
    case 'disabledAddBranch':
        return {
            ...state,
            allowAddBranch: false
        }
    case 'allowExpendBranch':
        return {
            ...state,
            allowExpendBranch: true
        }
    case 'disabledExpendBranch':
        return {
            ...state,
            allowExpendBranch: false
        }
    case 'allowDelete':
        return {
            ...state,
            allowDelete: true
        }
    case 'disabledDelete':
        return {
            ...state,
            allowDelete: false
        }
    case 'init':
        return {
            allowAddStep: false,
            allowAddBranch: false,
            allowExpendBranch: false,
            allowDelete: false,
            allowUndo: false,
            allowRecover: false
        }
    default:
        return state
    }
}
// transfer的时候程序选择一个unit/Op/Phase,递归找父级及其title
export const findParentTitles = ({ treeData, targetTitle, path = [] }) => {
    for (let i = 0; i < treeData.length; i += 1) {
        if (treeData[i].title === targetTitle) {
            path.push(treeData[i].title)
            return path.join(',')
        }
        if (treeData[i].children) {
            const found = findParentTitles({
                treeData: treeData[i].children,
                targetTitle,
                path: path.concat(treeData[i].title)
            })
            if (found) {
                return found
            }
        }
    }
    return null
}
/**
 * 递归更新svg的数据结构,每当svg的数据更新的时候,就重新将所获得的内容进行编码
 * transfer 编码为T1
 * step 编码为001
 * @param {Object} data - 选项对象
 * @returns {Object|undefined} -
   [...
    { expr:"true"
    id:"8ea47c7f-6f22-4c22-b34e-2c6aa7e9084f"
    status: "ready"
    text:"T1"
    type : "transfer"}
    {instance_name: 3
    instance_id:3,
    id: "f0fc0469-6742-4250-82f7-fc521341a38e"
    text :"001"
    type : "step"}
    ...]
 */
// 把变量提出的原因,Array.isArray的时候取不到内层的变量
let counter = 0
let stepcun = 0

export const recursiveToUpdateNodeNum = (data, counters, stepcuns) => {
    const cpData = [...data]
    if (counters === undefined) {
        counter = 0
    }
    if (stepcuns === undefined) {
        stepcun = 0
    }

    return cpData.map(item => {
        if (item.type === 'transfer') {
            counter += 1
            return {
                ...item,
                text: `T${counter}`
            }
        }
        if (item.type === 'step') {
            stepcun += 1
            let numberString = stepcun.toString()
            while (numberString.length < 3) {
                numberString = `0${numberString}`
            }
            return {
                ...item,
                text: `${numberString}`
            }
        }

        if (Array.isArray(item)) {
            return recursiveToUpdateNodeNum(item, counter, stepcun)
        }

        if (item.steps) {
            return {
                ...item,
                steps: recursiveToUpdateNodeNum(item.steps, counter, stepcun)
            }
        }
        return item
    })
}
/**
  * @description 递归遍历sfc,找被sfc绑定的instance_name和instance_id的内容,形成复制实例的数组内容
  */
const recursiveToFindCopyInstanceResult = []
export const recursiveToFindCopyInstance = (data) => {
    const cpData = [...data]
    cpData.forEach(item => {
        if (item.type === 'step' && item.instance_id && item.instance_name) {
            recursiveToFindCopyInstanceResult.push({
                value: item.instance_id,
                label: item.instance_name
            })
        }

        if (Array.isArray(item)) {
            recursiveToFindCopyInstance(item)
        }

        if (item.steps) {
            recursiveToFindCopyInstance(item.steps) // 递归调用
        }
    })
    return Array.from(new Set(recursiveToFindCopyInstanceResult.map(JSON.stringify))).map(JSON.parse) // 数组去重
}
