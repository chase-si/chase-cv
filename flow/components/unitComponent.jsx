import React, { memo } from 'react'

import { COLOR } from '../tokens'

import {
    getHeight,
    getWidth,
    getNewY,
    getNewX,
    getSVG
} from './renderSVG'
import {
    UNIT, RATIO, SLIT, FONT, FILL, YELLOW_FILL, ARROR_OFFSET
} from '../constants'

// 本文件的功能是封装渲染svg节点, 返回一个jsx SVG元素
// 包含基础的Line, DoubleLine, Desc, ButtonVLine, PaddingLine,
// 以及复合的数据结构里的单'节点' Transfer, EndStep, SeqSVG, CondSVG等

/**
 * @description 单线
 * @param {
 *  y: number,
 *  num: number
 * }
 * @returns svgLineElement
 */
export const Line = memo(({
    y,
    num
}) => {
    return (
        <g>
            <line
                x1={UNIT * 0.1}
                y1={y}
                x2={UNIT * num * (RATIO + 1)}
                y2={y}
                stroke="black"
                strokeWidth="1"
            />
        </g>
    )
})

export const ActiveArrow = memo(({
    x,
    y,
    length = 10,
    width = 4
}) => {
    const lineEnd = x + length
    const triangleHeight = width * 4
    const triangleStartX = lineEnd
    const startY = y + (width / 2)

    return (
        <g>
            <path
                d={`M${x} ${startY} L${lineEnd} ${startY}`}
                stroke="green"
                fill="green"
                strokeWidth={width}
            />
            <polygon
                points={`
                    ${triangleStartX},${startY} 
                    ${lineEnd},${startY + (triangleHeight / 2)} 
                    ${lineEnd + triangleHeight},${startY} 
                    ${lineEnd},${startY - (triangleHeight / 2)}
                `}
                fill="green"
            />
        </g>
    )
})

/**
 * @description 可点击激活的单线, 出现在条件分支节点的上方
 * @param {
*  y: number,
*  num: number
* }
* @returns svgLineElement
*/
export const ClickableLine = memo(({
    y,
    num,
    onClick,
    active
}) => {
    return (
        <g
            onClick={onClick}
        >
            {/* 可点击的active区域 */}
            <rect
                x={UNIT * 0.1}
                y={y - (UNIT * 0.1)}
                width={UNIT * num * (RATIO + 1)}
                height={UNIT * 0.2}
                fill={COLOR.mainLightBlue}
                opacity={active ? 1 : 0}
            />
            <line
                x1={UNIT * 0.1}
                y1={y}
                x2={UNIT * num * (RATIO + 1)}
                y2={y}
                stroke="black"
                strokeWidth="1"
            />
        </g>
    )
})

/**
 * @description Renders a SVG double line component.
 *
 * @param {Object} props - The component props.
 * @param {number} props.y - The y-coordinate of the lines.
 * @param {number} props.num - The number of lines to render.
 * @returns {JSX.Element} The double line component.
 */
export const DoubleLine = ({
    y, num
}) => {
    return (
        <g>
            <line
                x1={UNIT * 0.1}
                y1={y + 1}
                x2={UNIT * num * (RATIO + 1)}
                y2={y + 1}
                stroke="black"
                strokeWidth="2"
            />
            <line
                x1={UNIT * 0.1}
                y1={SLIT + y}
                x2={UNIT * num * (RATIO + 1)}
                y2={SLIT + y}
                stroke="black"
                strokeWidth="2"
            />
        </g>
    )
}

/**
 * @description 可点击激活的单线, 出现在条件分支节点的上方
 * @param {number} y - The y-coordinate of the component.
 * @param {number} num - The number of units.
 * @param {function} onClick - The click event handler.
 * @param {boolean} active - Indicates if the component is active.
 * @returns {JSX.Element} The clickable double line component.
 */
export const ClickableDoubleLine = memo(({
    y,
    num,
    onClick,
    active
}) => {
    return (
        <g onClick={onClick}>
            {/* 可点击的active区域 */}
            <rect
                x={UNIT * 0.1}
                y={y - (UNIT * 0.1)}
                width={UNIT * num * (RATIO + 1)}
                height={UNIT * 0.2 + SLIT - 1}
                fill={COLOR.mainLightBlue}
                opacity={active ? 1 : 0}
            />
            <line
                x1={UNIT * 0.1}
                y1={y + 1}
                x2={UNIT * num * (RATIO + 1)}
                y2={y + 1}
                stroke="black"
                strokeWidth="2"
            />
            <line
                x1={UNIT * 0.1}
                y1={SLIT + y}
                x2={UNIT * num * (RATIO + 1)}
                y2={SLIT + y}
                stroke="black"
                strokeWidth="2"
            />
        </g>
    )
})

/**
 * Renders a SVG description component.
 *svg
 * @param {Object} props - The component props.
 * @param {number} props.x - The x-coordinate of the component.
 * @param {number} props.y - The y-coordinate of the component.
 * @param {number} props.width - The width of the component.
 * @param {number} props.height - The height of the component.
 * @param {string} props.descStr - The description string.
 * @param {string} props.instance_name - The instance name.
 * @param {string} props.status - The status of the component.
 * @param {string} props.active - 当前组件是否被选中激活.
 * @param {string} props.fillColol - 填充颜色
 * @returns {JSX.Element} The rendered description component.
 */
export const Desc = ({
    x,
    y,
    width,
    height,
    descStr,
    instance_name,
    status,
    active,
    fillColol
}) => {
    const lineLen = 20
    const descX = x + width + lineLen
    const descWidth = RATIO * width
    const padding = UNIT * 0.1

    return (
        <g>
            {/* 激活背景色rect */}
            <rect
                x={x + width + 1}
                y={y - padding + 1}
                width={descWidth + padding * 2 + lineLen}
                height={height + padding * 2 - 1}
                fill={COLOR.mainLightBlue}
                opacity={active ? 1 : 0}
            />
            <line
                x1={x + width}
                y1={y + height / 2}
                x2={lineLen + x + width}
                y2={y + height / 2}
                stroke={status === 'finished' ? 'red' : 'green'}
                strokeWidth="2"
            />
            <rect
                x={descX}
                y={y}
                width={descWidth}
                height={height}
                fill={fillColol}
                stroke={status === 'finished' ? 'red' : 'green'}
                strokeWidth="2"
            />
            <text
                x={descX + descWidth / 2}
                y={y + height / 2}
                fontSize={FONT}
                dominantBaseline="middle"
                textAnchor="middle"
            >
                {instance_name}
            </text>
        </g>
    )
}

/**
 * Renders a SVG vertical line component.
 *
 * @param {number} y1 - The y-coordinate of the starting point of the line.
 * @param {number} y2 - The y-coordinate of the ending point of the line.
 * @returns {JSX.Element} The rendered line component.
 */
export const ButtonVLine = ({ y1, y2 }) => {
    return (
        <line
            x1={UNIT * 0.5}
            y1={y1}
            x2={UNIT * 0.5}
            y2={y2}
            stroke="black"
            strokeWidth="2"
        />
    )
}

const getFillColor = ({
    idColorMap,
    id,
    defaultColor,
    startFlag
}) => {
    if (startFlag) {
        return defaultColor
    }
    if (idColorMap && idColorMap[id]) {
        console.log(1111)
        return idColorMap[id]
    }
    return defaultColor
}

/**
 * Renders a step description component.
 *
 * @param {Object} props - The component props.
 * @param {number} [props.x=UNIT * 0.1] - The x-coordinate of the component.
 * @param {number} [props.y=UNIT * 0.1] - The y-coordinate of the component.
 * @param {number} [props.width=UNIT * 0.8] - The width of the component.
 * @param {number} [props.height=UNIT * 0.8] - The height of the component.
 * @param {string} props.text - 方框内的文字
 * @param {boolean} [props.startFlag=false] - Indicates if the component is a start flag.
 * @param {string} props.instance_name - 描述文字.选择实例的名称
 * @param {string} props.instance_id - 选择实例的id
 * @param {string} props.status - The status of the component.
 * @returns {JSX.Element} The rendered step description component.
 */
export const StepDesc = memo(({
    x = UNIT * 0.1,
    y = UNIT * 0.1,
    width = UNIT * 0.8,
    height = UNIT * 0.8,
    startFlag = false,
    text,
    descStr,
    instance_name,
    status,
    instance_id,
    ...restProps // 后期拓展用
}) => {
    // 因为 width 和 height 设成了UNIT的0.8, 所以<g>以内有个padding控件
    const padding = UNIT * 0.1
    const {
        svgDomOnClick = () => {},
        activeId,
        id,
        idColorMap,
        greenArrowIds
    } = restProps
    const active = activeId === id
    const greenArrow = greenArrowIds.includes(id) && !startFlag
    const fillColor = getFillColor({
        idColorMap,
        id,
        defaultColor: FILL,
        startFlag
    })
    // console.log('fillColor', id, fillColor)

    return (
        <g
            data-id={id}
            onClick={() => svgDomOnClick(id)}
        >
            {/* 选中激活背景色rect */}
            <rect
                x={x - padding}
                y={y - padding + 1}
                width={UNIT}
                height={UNIT - 1}
                fill={COLOR.mainLightBlue}
                opacity={active ? 1 : 0}
            />
            {greenArrow && (
                <ActiveArrow
                    x={x - ARROR_OFFSET}
                    y={y + (height / 2)}
                />
            )}
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fillColor}
                stroke={status === 'finished' ? 'red' : 'green'}
                strokeWidth="2"
            />
            {startFlag
                && (
                    <rect
                        x={UNIT * 0.2}
                        y={UNIT * 0.2}
                        width={UNIT * 0.6}
                        height={UNIT * 0.6}
                        fill="none"
                        stroke={status === 'finished' ? 'red' : 'green'}
                        strokeWidth="2"
                    />
                )}
            <ButtonVLine y1={UNIT * 0.9} y2={UNIT} />
            {!startFlag
                && (
                    <line
                        x1={UNIT * 0.5}
                        y1={-5}
                        x2={UNIT * 0.5}
                        y2={UNIT * 0.1}
                        stroke="black"
                        strokeWidth="2"
                    />
                )}
            <text
                x={x + width / 2}
                y={y + height / 2}
                fontSize={FONT}
                dominantBaseline="middle"
                textAnchor="middle"
            >
                {text}
            </text>
            <Desc
                x={x}
                y={y}
                width={width}
                height={height}
                status={status}
                instance_name={instance_name}
                active={active}
                fillColol={fillColor}
            />
        </g>
    )
})

/**
 * 填充线
 * Represents a padding line component.
 * @param {number} h - The height of the padding line.
 * @returns {JSX.Element} The rendered padding line component.
 */
export const PaddingLine = ({ h }) => {
    const x = UNIT * 0.1
    const y = UNIT * 0.1
    const width = UNIT * 0.8

    return (
        <g>
            <line
                x1={x + width / 2}
                y1={0}
                x2={x + width / 2}
                y2={y + h}
                stroke="black"
                strokeWidth="2"
            />
        </g>
    )
}
/**
 * @param {string} text - 显示的编号
 * @param {string} expr - 条件
 * @param {boolean} jump - 是否跳转
 * @param {string} status - 执行状态
 * @returns
 */
export const Transfer = ({
    text, expr, jump = false, status,
    ...restProps
}) => {
    const {
        svgDomOnClick = () => {},
        activeId,
        id
    } = restProps
    const x = UNIT * 0.1
    const y = UNIT * 0.1
    const width = UNIT * 0.8
    const height = UNIT
    const color = ['finished', 'passed', 'blocked'].includes(status) ? 'red' : 'green'
    const active = activeId === id

    return (
        <g onClick={() => svgDomOnClick(id)}>
            {/* 激活背景色rect */}
            <rect
                x={0}
                y={y + (UNIT * 0.05)}
                width={UNIT}
                height={UNIT * 0.8}
                fill={COLOR.mainLightBlue}
                opacity={active ? 1 : 0}
            />
            <line
                x1={x + width / 2}
                y1={0}
                x2={x + width / 2}
                y2={y + (jump ? height / 2 : height)}
                stroke="black"
                strokeWidth="2"
            />
            {jump
                && (
                    <path
                        d={`M${Math.floor(x + width / 2)} ${Math.floor(height / 2)} l0 ${Math.floor(UNIT * 0.4)} m-8 -8 l8 8 l8 -8`}
                        stroke={color}
                        fill={color}
                        strokeWidth="2"
                    />
                )}
            <rect
                x={x}
                y={(y + height) / 2}
                width={width}
                height={3}
                fill={color}
                stroke={color}
            />
            <text
                x={x - width / 2}
                y={(y + height) / 2}
                fontSize={FONT}
                dominantBaseline="middle"
                textAnchor="left"
            >
                {text}
            </text>
            <text
                x={x + width + 2}
                width={width}
                y={(y + height) / 2}
                fontSize={FONT}
                dominantBaseline="middle"
                textAnchor="left"
            >
                {expr}
            </text>
        </g>
    )
}

// 结束节点的中横岗
const CenterRect = ({
    x, y, width, height, ratio
}) => {
    const len = width * ratio

    return (
        <rect
            x={x + width / 2 - len / 2}
            y={y + (1 - ratio) * height}
            width={width * ratio}
            height={2}
            fill="red"
            stroke="red"
        />
    )
}

// 结束节点SVG
export const EndStep = ({
    x = UNIT * 0.1, y = UNIT * 0.1, width = UNIT * 0.8, height = UNIT
}) => {
    return (
        <g>
            <line
                x1={x + width / 2}
                y1={y * 0.5}
                x2={x + width / 2}
                y2={y + height}
                stroke="black"
                strokeWidth="2"
            />
            <CenterRect x={x} y={y} width={width} height={height} ratio={0.8} />
            <CenterRect x={x} y={y} width={width} height={height} ratio={0.6} />
            <CenterRect x={x} y={y} width={width} height={height} ratio={0.4} />
            <CenterRect x={x} y={y} width={width} height={height} ratio={0.2} />
            <CenterRect x={x} y={y} width={width} height={height} ratio={0.05} />
        </g>
    )
}

// array(seq)类型的svg节点渲染
// 代码翻译自clojure => defmethod svg :seq
export const SeqSVG = ({
    datas,
    bindProps
}) => {
    const h = datas
        .map(item => getHeight(item))
        .reduce((acc, cur) => acc + cur, 0)

    return (
        <g>
            {datas.map((item, idx) => (
                <g
                    key={idx}
                    transform={`translate(0, ${getNewY(h, idx, datas)})`}
                >
                    {getSVG(item, bindProps)}
                </g>
            ))}
        </g>
    )
}

// 条件分支节点svg
// 代码翻译自clojure => defmethod svg :cond
export const CondSVG = (props) => {
    const {
        steps = [],
        activeId,
        svgDomOnClick,
        id,
        ...restProps
    } = props
    const h = Math.max(
        ...steps.map(item => getHeight(item))
    )
    const w = steps
        .map(item => getWidth(item))
        .reduce((acc, cur) => acc + cur, 0)
    const active = activeId === id

    return (
        <g>
            <ClickableLine
                y={1}
                num={w}
                active={active}
                onClick={() => svgDomOnClick(id)}
            />
            {steps.map((item, idx) => (
                <g
                    key={idx}
                    transform={`translate(${getNewX(w, idx, steps)}, 0)`}
                >
                    {getSVG(item, {
                        activeId,
                        svgDomOnClick,
                        ...restProps
                    })}
                    <g
                        transform={`translate(0, ${getHeight(item)})`}
                    >
                        <PaddingLine h={h - getHeight(item) - SLIT - 1} />
                    </g>
                </g>
            ))}
            {/* 因为增加了上横线的可点击区域, 整体线宽度向下扩大 可点击出去(UNIT * 0.2) / 4 */}
            <Line y={h + 5} num={w} />
        </g>
    )
}

// 并行分支节点SVG
// 代码翻译自clojure => defmethod svg :para
export const ParaSVG = (props) => {
    const {
        steps = [],
        activeId,
        svgDomOnClick,
        id,
        ...restProps
    } = props
    const h = Math.max(
        ...steps.map(item => getHeight(item))
    ) + (2 * SLIT) + 5
    const w = steps
        .map(item => getWidth(item))
        .reduce((acc, cur) => acc + cur, 0)
    const active = activeId === id

    return (
        <g>
            <ClickableDoubleLine
                y={0}
                num={w}
                onClick={() => svgDomOnClick(id)}
                active={active}
            />
            {steps.map((item, idx) => (
                <g
                    key={idx}
                    transform={`translate(${getNewX(w, idx, steps)}, ${SLIT + 5})`}
                >
                    {getSVG(item, {
                        activeId,
                        svgDomOnClick,
                        ...restProps
                    })}
                    <g
                        transform={`translate(0, ${getHeight(item)})`}
                    >
                        <PaddingLine h={h - getHeight(item) - (2 * SLIT)} />
                    </g>
                </g>
            ))}
            <DoubleLine y={h} num={w} />
        </g>
    )
}
