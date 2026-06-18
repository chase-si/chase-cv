import type { FlowStepStatus } from "@/lib/flow/types";
import {
  FLOW_ARROW_OFFSET,
  FLOW_DESC_RATIO,
  FLOW_FONT_SIZE,
  FLOW_NODE_FILL,
  FLOW_PARALLEL_SLIT,
  FLOW_UNIT,
} from "@/lib/flow/constants";
import {
  FLOW_SVG_ACTIVE_OVERLAY,
  FLOW_SVG_FINISHED_STROKE,
  FLOW_SVG_PROGRESS_ARROW,
  FLOW_SVG_RUNNING_STROKE,
  FLOW_SVG_STROKE,
} from "@/components/flow/flow-svg-tokens";

export function flowStatusStroke(status?: FlowStepStatus) {
  return status === "finished" ? FLOW_SVG_FINISHED_STROKE : FLOW_SVG_RUNNING_STROKE;
}

export function FlowSvgLine({ y, num }: { y: number; num: number }) {
  return (
    <g>
      <line
        x1={FLOW_UNIT * 0.1}
        y1={y}
        x2={FLOW_UNIT * num * (FLOW_DESC_RATIO + 1)}
        y2={y}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="1"
      />
    </g>
  );
}

export function FlowSvgActiveArrow({
  x,
  y,
  nodeId,
}: {
  x: number;
  y: number;
  nodeId: string;
}) {
  const length = 10;
  const width = 4;
  const lineEnd = x + length;
  const triangleHeight = width * 4;
  const triangleStartX = lineEnd;
  const startY = y + width / 2;

  return (
    <g data-flow-green-arrow={nodeId}>
      <path
        d={`M${x} ${startY} L${lineEnd} ${startY}`}
        stroke={FLOW_SVG_PROGRESS_ARROW}
        fill={FLOW_SVG_PROGRESS_ARROW}
        strokeWidth={width}
      />
      <polygon
        points={`
                    ${triangleStartX},${startY} 
                    ${lineEnd},${startY + triangleHeight / 2} 
                    ${lineEnd + triangleHeight},${startY} 
                    ${lineEnd},${startY - triangleHeight / 2}
                `}
        fill={FLOW_SVG_PROGRESS_ARROW}
      />
    </g>
  );
}

export function FlowSvgDoubleLine({ y, num }: { y: number; num: number }) {
  return (
    <g>
      <line
        x1={FLOW_UNIT * 0.1}
        y1={y + 1}
        x2={FLOW_UNIT * num * (FLOW_DESC_RATIO + 1)}
        y2={y + 1}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="2"
      />
      <line
        x1={FLOW_UNIT * 0.1}
        y1={FLOW_PARALLEL_SLIT + y}
        x2={FLOW_UNIT * num * (FLOW_DESC_RATIO + 1)}
        y2={FLOW_PARALLEL_SLIT + y}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="2"
      />
    </g>
  );
}

export function FlowSvgPaddingLine({ h }: { h: number }) {
  const x = FLOW_UNIT * 0.1;
  const y = FLOW_UNIT * 0.1;
  const width = FLOW_UNIT * 0.8;

  return (
    <g>
      <line
        x1={x + width / 2}
        y1={0}
        x2={x + width / 2}
        y2={y + h}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="2"
      />
    </g>
  );
}

export function FlowSvgButtonVLine({ y1, y2 }: { y1: number; y2: number }) {
  return (
    <line
      x1={FLOW_UNIT * 0.5}
      y1={y1}
      x2={FLOW_UNIT * 0.5}
      y2={y2}
      stroke={FLOW_SVG_STROKE}
      strokeWidth="2"
    />
  );
}

function FlowStepDescriptionPanel({
  x,
  y,
  width,
  height,
  descStr,
  status,
  active,
  fillColor,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  descStr?: string;
  status?: FlowStepStatus;
  active: boolean;
  fillColor: string;
}) {
  const lineLen = 20;
  const descX = x + width + lineLen;
  const descWidth = FLOW_DESC_RATIO * width;
  const padding = FLOW_UNIT * 0.1;
  const stroke = flowStatusStroke(status);

  return (
    <g>
      <rect
        x={x + width + 1}
        y={y - padding + 1}
        width={descWidth + padding * 2 + lineLen}
        height={height + padding * 2 - 1}
        fill={FLOW_SVG_ACTIVE_OVERLAY}
        opacity={active ? 0.25 : 0}
      />
      <line
        x1={x + width}
        y1={y + height / 2}
        x2={lineLen + x + width}
        y2={y + height / 2}
        stroke={stroke}
        strokeWidth="2"
      />
      <rect
        x={descX}
        y={y}
        width={descWidth}
        height={height}
        fill={fillColor}
        stroke={stroke}
        strokeWidth="2"
      />
      <text
        x={descX + descWidth / 2}
        y={y + height / 2}
        fontSize={FLOW_FONT_SIZE}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {descStr ?? ""}
      </text>
    </g>
  );
}

function resolveNodeFill({
  id,
  idColorMap,
  startFlag,
}: {
  id?: string;
  idColorMap?: Record<string, string>;
  startFlag?: boolean;
}) {
  if (startFlag) {
    return FLOW_NODE_FILL;
  }
  if (id && idColorMap?.[id]) {
    return idColorMap[id]!;
  }
  return FLOW_NODE_FILL;
}

export type FlowSvgBindProps = {
  activeId?: string | null;
  svgDomOnClick?: (id: string | undefined) => void;
  idColorMap?: Record<string, string>;
  greenArrowIds?: string[];
};

export function FlowSvgStepDesc({
  x = FLOW_UNIT * 0.1,
  y = FLOW_UNIT * 0.1,
  width = FLOW_UNIT * 0.8,
  height = FLOW_UNIT * 0.8,
  startFlag = false,
  text,
  descStr,
  status,
  id,
  activeId,
  svgDomOnClick,
  idColorMap,
  greenArrowIds = [],
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  startFlag?: boolean;
  text?: string;
  descStr?: string;
  status?: FlowStepStatus;
  id?: string;
} & FlowSvgBindProps) {
  const padding = FLOW_UNIT * 0.1;
  const active = activeId === id;
  const greenArrow = id ? greenArrowIds.includes(id) && !startFlag : false;
  const fillColor = resolveNodeFill({ id, idColorMap, startFlag });
  const stroke = flowStatusStroke(status);

  return (
    <g
      data-flow-node-id={id}
      data-flow-selected={active ? "true" : undefined}
      onClick={() => svgDomOnClick?.(id)}
      role={svgDomOnClick ? "button" : undefined}
    >
      <rect
        x={x - padding}
        y={y - padding + 1}
        width={FLOW_UNIT}
        height={FLOW_UNIT - 1}
        fill={FLOW_SVG_ACTIVE_OVERLAY}
        opacity={active ? 0.2 : 0}
      />
      {greenArrow && id ? (
        <FlowSvgActiveArrow
          x={x - FLOW_ARROW_OFFSET}
          y={y + height / 2}
          nodeId={id}
        />
      ) : null}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fillColor}
        stroke={stroke}
        strokeWidth="2"
      />
      {startFlag ? (
        <rect
          x={FLOW_UNIT * 0.2}
          y={FLOW_UNIT * 0.2}
          width={FLOW_UNIT * 0.6}
          height={FLOW_UNIT * 0.6}
          fill="none"
          stroke={stroke}
          strokeWidth="2"
        />
      ) : null}
      <FlowSvgButtonVLine y1={FLOW_UNIT * 0.9} y2={FLOW_UNIT} />
      {!startFlag ? (
        <line
          x1={FLOW_UNIT * 0.5}
          y1={-5}
          x2={FLOW_UNIT * 0.5}
          y2={FLOW_UNIT * 0.1}
          stroke={FLOW_SVG_STROKE}
          strokeWidth="2"
        />
      ) : null}
      <text
        x={x + width / 2}
        y={y + height / 2}
        fontSize={FLOW_FONT_SIZE}
        dominantBaseline="middle"
        textAnchor="middle"
      >
        {text}
      </text>
      <FlowStepDescriptionPanel
        x={x}
        y={y}
        width={width}
        height={height}
        descStr={descStr}
        status={status}
        active={active}
        fillColor={fillColor}
      />
    </g>
  );
}

export function FlowSvgTransfer({
  text,
  expr,
  jump = false,
  status,
  id,
  activeId,
  svgDomOnClick,
}: {
  text?: string;
  expr?: string | boolean;
  jump?: boolean;
  status?: FlowStepStatus;
  id?: string;
} & FlowSvgBindProps) {
  const x = FLOW_UNIT * 0.1;
  const y = FLOW_UNIT * 0.1;
  const width = FLOW_UNIT * 0.8;
  const height = FLOW_UNIT;
  const color = flowStatusStroke(
    ["finished", "passed", "blocked"].includes(status ?? "") ? "finished" : status,
  );
  const active = activeId === id;
  const exprLabel =
    expr === undefined || expr === null ? "" : String(expr);

  return (
    <g
      data-flow-node-id={id}
      data-flow-selected={active ? "true" : undefined}
      onClick={() => svgDomOnClick?.(id)}
      role={svgDomOnClick ? "button" : undefined}
    >
      <rect
        x={0}
        y={y + FLOW_UNIT * 0.05}
        width={FLOW_UNIT}
        height={FLOW_UNIT * 0.8}
        fill={FLOW_SVG_ACTIVE_OVERLAY}
        opacity={active ? 0.2 : 0}
      />
      <line
        x1={x + width / 2}
        y1={0}
        x2={x + width / 2}
        y2={y + (jump ? height / 2 : height)}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="2"
      />
      {jump ? (
        <path
          d={`M${Math.floor(x + width / 2)} ${Math.floor(height / 2)} l0 ${Math.floor(FLOW_UNIT * 0.4)} m-8 -8 l8 8 l8 -8`}
          stroke={color}
          fill={color}
          strokeWidth="2"
        />
      ) : null}
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
        fontSize={FLOW_FONT_SIZE}
        dominantBaseline="middle"
        textAnchor="start"
      >
        {text}
      </text>
      <text
        x={x + width + 2}
        y={(y + height) / 2}
        fontSize={FLOW_FONT_SIZE}
        dominantBaseline="middle"
        textAnchor="start"
      >
        {exprLabel}
      </text>
    </g>
  );
}

function FlowSvgEndCenterBar({
  x,
  y,
  width,
  height,
  ratio,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  ratio: number;
}) {
  const len = width * ratio;

  return (
    <rect
      x={x + width / 2 - len / 2}
      y={y + (1 - ratio) * height}
      width={width * ratio}
      height={2}
      fill={FLOW_SVG_FINISHED_STROKE}
      stroke={FLOW_SVG_FINISHED_STROKE}
    />
  );
}

export function FlowSvgEndStep({
  x = FLOW_UNIT * 0.1,
  y = FLOW_UNIT * 0.1,
  width = FLOW_UNIT * 0.8,
  height = FLOW_UNIT,
  id,
  activeId,
  svgDomOnClick,
}: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  id?: string;
} & FlowSvgBindProps) {
  const active = activeId === id;

  return (
    <g
      data-flow-node-id={id}
      data-flow-node-type="end"
      onClick={() => svgDomOnClick?.(id)}
      role={svgDomOnClick ? "button" : undefined}
      data-flow-selected={active ? "true" : undefined}
    >
      <rect
        x={0}
        y={0}
        width={FLOW_UNIT}
        height={FLOW_UNIT}
        fill={FLOW_SVG_ACTIVE_OVERLAY}
        opacity={active ? 0.2 : 0}
      />
      <line
        x1={x + width / 2}
        y1={y * 0.5}
        x2={x + width / 2}
        y2={y + height}
        stroke={FLOW_SVG_STROKE}
        strokeWidth="2"
      />
      {[0.8, 0.6, 0.4, 0.2, 0.05].map((ratio) => (
        <FlowSvgEndCenterBar
          key={ratio}
          x={x}
          y={y}
          width={width}
          height={height}
          ratio={ratio}
        />
      ))}
    </g>
  );
}
