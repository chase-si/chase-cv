import React, {
    useCallback, useEffect, useReducer, useState
} from 'react'
import Decimal from 'decimal.js'

import Siderbar from './components/siderbar'
import { RenderSVG } from './components/renderSVG'
import { NODE_TYPE, OPERATE_TYPE } from './constants'
import { EditorLayout, FlowCanvas } from './style'
import {
    handleClickAddBranch as addBranchUtil,
    handleClickAddStep as addStepUtil,
    handleClickDelete as deleteUtil,
    handleClickExpandBranch as expandBranchUtil,
    iconDisabledReducer,
    recursiveToFindNode
} from './utils'

const ICON_INIT = {
    allowAddStep: false,
    allowAddBranch: false,
    allowExpendBranch: false,
    allowDelete: false,
    allowUndo: false,
    allowRecover: false
}

const updateIconState = (dispatchIcon, selectedId, selectedData) => {
    if (!selectedId) {
        dispatchIcon({ type: 'init' })
        return
    }
    if (
        [NODE_TYPE.start.type, NODE_TYPE.step.type, NODE_TYPE.transfer.type]
            .includes(selectedData?.type)
    ) {
        dispatchIcon({ type: 'allowAddStep' })
    } else {
        dispatchIcon({ type: 'disabledAddStep' })
    }
    if (
        [NODE_TYPE.step.type, NODE_TYPE.transfer.type]
            .includes(selectedData?.type)
    ) {
        dispatchIcon({ type: 'allowDelete' })
    } else {
        dispatchIcon({ type: 'disabledDelete' })
    }
    if (selectedData?.type === NODE_TYPE.transfer.type
        || selectedData?.type === NODE_TYPE.step.type) {
        dispatchIcon({ type: 'allowAddBranch' })
    } else {
        dispatchIcon({ type: 'disabledAddBranch' })
    }
    if (selectedData?.type === NODE_TYPE.cond.type
        || selectedData?.type === NODE_TYPE.para.type) {
        dispatchIcon({ type: 'allowExpendBranch' })
    } else {
        dispatchIcon({ type: 'disabledExpendBranch' })
    }
}

const defaultNotify = (level, text) => {
    if (level === 'error') {
        console.error(text)
    } else {
        console.info(text)
    }
}

/**
 * 可嵌入的 SFC 流程图编辑器（渲染 + 工具栏 + 本地改树，不含保存接口）
 * @param {Object} props
 * @param {Array} props.datas - 流程 JSON（与后端 sfc_flow 调度结构一致）
 * @param {Function} props.onChange - (newDatas) => void
 * @param {boolean} [props.showToolbar=true]
 * @param {Function} [props.onNotify] - (level: 'info'|'error', message: string) => void
 * @param {Object} [props.idColorMap] - 运行态着色
 * @param {string[]} [props.greenArrowIds]
 */
const FlowEditor = ({
    datas,
    onChange,
    showToolbar = true,
    onNotify = defaultNotify,
    idColorMap,
    greenArrowIds
}) => {
    const [activeId, setActiveId] = useState(null)
    const [shrinksFactor, setShrinksFactor] = useState(1)
    const [iconDisabledState, dispatchIcon] = useReducer(iconDisabledReducer, ICON_INIT)

    useEffect(() => {
        setActiveId(null)
        dispatchIcon({ type: 'init' })
    }, [datas])

    const handleSelected = useCallback((selectedId) => {
        setActiveId(selectedId)
        const selectedData = recursiveToFindNode({
            wholeTreeData: datas,
            id: selectedId
        })
        updateIconState(dispatchIcon, selectedId, selectedData)
    }, [datas])

    const handleChangeSize = (operateType) => {
        if (operateType === OPERATE_TYPE.放大) {
            setShrinksFactor(new Decimal(shrinksFactor).plus(0.1).toNumber())
        }
        if (operateType === OPERATE_TYPE.缩小) {
            if (shrinksFactor <= 0.1) {
                onNotify('info', '最小缩小到 1/10')
                return
            }
            setShrinksFactor(new Decimal(shrinksFactor).minus(0.1).toNumber())
        }
        if (operateType === OPERATE_TYPE.正常) {
            setShrinksFactor(1)
        }
    }

    const requireSelection = () => {
        if (!activeId) {
            onNotify('info', '请先在流程图中选中一个节点')
            return false
        }
        return true
    }

    const applyFlow = (newFlowData) => {
        onChange(newFlowData)
    }

    const handleClickAddStep = () => {
        if (!requireSelection()) return
        try {
            const { newFlowData } = addStepUtil({ renderData: datas, activeId })
            applyFlow(newFlowData)
        } catch (e) {
            onNotify('error', e?.message || '增加顺序步失败')
        }
    }

    const handleClickAddBranchFn = () => {
        if (!requireSelection()) return
        try {
            const { newFlowData } = addBranchUtil({ renderData: datas, activeId })
            applyFlow(newFlowData)
        } catch (e) {
            onNotify('error', e?.message || '增加分支失败')
        }
    }

    const handleClickExpandBranchFn = () => {
        if (!requireSelection()) return
        try {
            const { newFlowData } = expandBranchUtil({ renderData: datas, activeId })
            applyFlow(newFlowData)
        } catch (e) {
            onNotify('error', e?.message || '扩展分支失败')
        }
    }

    const handleClickDeleteFn = () => {
        if (!requireSelection()) return
        try {
            const res = deleteUtil({ renderData: datas, activeId })
            if (res) {
                applyFlow(res.newFlowData)
                setActiveId(null)
                dispatchIcon({ type: 'init' })
            }
        } catch (e) {
            onNotify('info', e?.message || '当前节点不可删除')
        }
    }

    return (
        <EditorLayout>
            {showToolbar && (
                <Siderbar
                    handleChangeSize={handleChangeSize}
                    handleClickAddStep={handleClickAddStep}
                    handleClickAddBranch={handleClickAddBranchFn}
                    handleClickExpandBranch={handleClickExpandBranchFn}
                    handleClickDelete={handleClickDeleteFn}
                    iconStatus={iconDisabledState}
                />
            )}
            <FlowCanvas>
                <RenderSVG
                    datas={datas}
                    shrinksFactor={shrinksFactor}
                    activeId={activeId}
                    svgDomOnClick={handleSelected}
                    idColorMap={idColorMap}
                    greenArrowIds={greenArrowIds}
                />
            </FlowCanvas>
        </EditorLayout>
    )
}

export default FlowEditor
