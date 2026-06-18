import React from 'react'

import {
    StepDesc,
    EndStep,
    Transfer,
    SeqSVG,
    CondSVG,
    ParaSVG
} from './unitComponent'
import {
    NODE_TYPE, ARROR_OFFSET
} from '../constants'
import {
    getHeight, getWidth, getNewY
} from './layoutMetrics'

const getType = (data) => {
    if (Array.isArray(data)) {
        return NODE_TYPE.seq.type
    }
    return data.type
}

/**
 * @param {*} data
 * {expr:"true"
    id:"8ea47c7f-6f22-4c22-b34e-2c6aa7e9084f"
    status:"ready"
    type: "transfer"}

    { descStr:""
    id:"f0fc0469-6742-4250-82f7-fc521341a38e"
    text: ""
    type:"step"}
 * @param {*} bindProps // 透传需要绑定到Transfer 和 StepDesc的props
    activeId:null
    backgroundColorYellowIds:[]
    greenArrowIds:[]
    svgDomOnClick:async selectedId => {…}
 * @returns {JSX.Element}
 */
const getSVG = (data, bindProps) => {
    const dataType = getType(data)

    switch (dataType) {
    case NODE_TYPE.step.type:
        return (
            <StepDesc
                {...data}
                {...bindProps}
            />
        )
    case NODE_TYPE.end.type:
        return (
            <EndStep />
        )
    case NODE_TYPE.start.type:
        return (
            <StepDesc
                startFlag
                {...data}
                {...bindProps}
            />
        )
    case NODE_TYPE.transfer.type:
        return (
            <Transfer
                {...data}
                {...bindProps}
            />
        )
    case NODE_TYPE.seq.type:
        return (
            <SeqSVG
                datas={[...data]}
                bindProps={bindProps}
            />
        )
    case NODE_TYPE.cond.type:
        return (
            <CondSVG
                {...data}
                {...bindProps}
            />
        )
    case NODE_TYPE.para.type:
        return (
            <ParaSVG
                {...data}
                {...bindProps}
            />
        )
    default:
        return <></>
    }
}

/**
 * 渲染SVG组件
 * @param {Object} props - 组件属性
 * @param {Array} props.datas - 数据数组, 必填
 * 对应后端的sfc_flow数据中的调度json数据
 * @param {number} props.shrinksFactor - 缩放倍数
 * @param {string} props.activeId - 激活的ID, 非必填
 * @param {Function} props.svgDomOnClick - SVG点击事件处理函数, 非必填
 * @param {Array} props.idColorMap - {id: color}的map结构, 非必填
 * @param {Array} props.greenArrowIds - 绿色箭头的ID数组, 非必填
 * @returns {JSX.Element} - 渲染的SVG元素
 */
const RenderSVG = (props) => {
    const {
        datas = [],
        shrinksFactor = 1, // 缩放倍数
        activeId,
        svgDomOnClick,
        idColorMap,
        greenArrowIds = []
    } = props
    // console.log('RenderSVG datas', datas)
    const x = Math.max(
        ...datas.map((item) => getWidth(item))
    ) + ARROR_OFFSET
    const y = datas
        .map((item) => getHeight(item))
        .reduce((acc, cur) => acc + cur, 0)

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            transform={`scale(${shrinksFactor})`}
            // eslint-disable-next-line react/no-unknown-property
            transform-origin="0 0"
            width={x}
            height={y}
        >
            {datas.map((item, idx) => (
                <g
                    key={idx}
                    transform={`translate(${ARROR_OFFSET}, ${getNewY(y, idx, datas)})`}
                >
                    {getSVG(
                        item,
                        {
                            activeId,
                            svgDomOnClick,
                            idColorMap,
                            greenArrowIds
                        }
                    )}
                </g>
            ))}
        </svg>
    )
}

export {
    getSVG,
    RenderSVG
}
export {
    getNewY,
    getNewX,
    getHeight,
    getWidth
} from './layoutMetrics'
