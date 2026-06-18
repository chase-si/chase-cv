"use client";

import type { FlowItem } from "@/lib/flow/types";
import { getFlowItemKind, isFlowSequence } from "@/lib/flow/types";
import {
  getFlowHeight,
  getFlowWidth,
  getNewFlowX,
  getNewFlowY,
} from "@/lib/flow/layout-metrics";
import {
  FLOW_ARROW_OFFSET,
  FLOW_DESC_RATIO,
  FLOW_PARALLEL_SLIT,
  FLOW_UNIT,
} from "@/lib/flow/constants";
import {
  type FlowSvgBindProps,
  FlowSvgDoubleLine,
  FlowSvgEndStep,
  FlowSvgLine,
  FlowSvgPaddingLine,
  FlowSvgStepDesc,
  FlowSvgTransfer,
} from "@/components/flow/flow-svg-primitives";

function lineNumFromWidth(width: number) {
  return width / (FLOW_UNIT * (FLOW_DESC_RATIO + 1));
}

function FlowSvgSeq({
  datas,
  bindProps,
}: {
  datas: FlowItem[];
  bindProps: FlowSvgBindProps;
}) {
  const h = datas
    .map((item) => getFlowHeight(item))
    .reduce((acc, cur) => acc + cur, 0);

  return (
    <g data-flow-node-type="seq">
      {datas.map((item, idx) => (
        <g key={idx} transform={`translate(0, ${getNewFlowY(h, idx, datas)})`}>
          {getFlowSvg(item, bindProps)}
        </g>
      ))}
    </g>
  );
}

function FlowSvgCond({
  steps = [],
  id,
  activeId,
  svgDomOnClick,
  ...restProps
}: {
  steps?: FlowItem[];
  id?: string;
} & FlowSvgBindProps) {
  const h = Math.max(...steps.map((item) => getFlowHeight(item)));
  const w = steps
    .map((item) => getFlowWidth(item))
    .reduce((acc, cur) => acc + cur, 0);
  const active = activeId === id;
  const bindProps: FlowSvgBindProps = {
    activeId,
    svgDomOnClick,
    ...restProps,
  };
  const lineNum = lineNumFromWidth(w);

  return (
    <g data-flow-node-id={id} data-flow-node-type="cond">
      <g
        onClick={() => svgDomOnClick?.(id)}
        role={svgDomOnClick ? "button" : undefined}
      >
        <rect
          x={0}
          y={-6}
          width={w}
          height={12}
          fill="var(--primary)"
          opacity={active ? 0.15 : 0}
        />
        <FlowSvgLine y={1} num={lineNum} />
      </g>
      {steps.map((item, idx) => (
        <g key={idx} transform={`translate(${getNewFlowX(w, idx, steps)}, 0)`}>
          {getFlowSvg(item, bindProps)}
          <g transform={`translate(0, ${getFlowHeight(item)})`}>
            <FlowSvgPaddingLine
              h={h - getFlowHeight(item) - FLOW_PARALLEL_SLIT - 1}
            />
          </g>
        </g>
      ))}
      <FlowSvgLine y={h + 5} num={lineNum} />
    </g>
  );
}

function FlowSvgPara({
  steps = [],
  id,
  activeId,
  svgDomOnClick,
  ...restProps
}: {
  steps?: FlowItem[];
  id?: string;
} & FlowSvgBindProps) {
  const h =
    Math.max(...steps.map((item) => getFlowHeight(item))) +
    2 * FLOW_PARALLEL_SLIT +
    5;
  const w = steps
    .map((item) => getFlowWidth(item))
    .reduce((acc, cur) => acc + cur, 0);
  const active = activeId === id;
  const bindProps: FlowSvgBindProps = {
    activeId,
    svgDomOnClick,
    ...restProps,
  };
  const lineNum = lineNumFromWidth(w);

  return (
    <g data-flow-node-id={id} data-flow-node-type="para">
      <g
        onClick={() => svgDomOnClick?.(id)}
        role={svgDomOnClick ? "button" : undefined}
      >
        <rect
          x={0}
          y={-6}
          width={w}
          height={12 + FLOW_PARALLEL_SLIT}
          fill="var(--primary)"
          opacity={active ? 0.15 : 0}
        />
        <FlowSvgDoubleLine y={0} num={lineNum} />
      </g>
      {steps.map((item, idx) => (
        <g
          key={idx}
          transform={`translate(${getNewFlowX(w, idx, steps)}, ${FLOW_PARALLEL_SLIT + 5})`}
        >
          {getFlowSvg(item, bindProps)}
          <g transform={`translate(0, ${getFlowHeight(item)})`}>
            <FlowSvgPaddingLine
              h={h - getFlowHeight(item) - 2 * FLOW_PARALLEL_SLIT}
            />
          </g>
        </g>
      ))}
      <FlowSvgDoubleLine y={h} num={lineNum} />
    </g>
  );
}

export function getFlowSvg(data: FlowItem, bindProps: FlowSvgBindProps) {
  const dataType = getFlowItemKind(data);

  switch (dataType) {
    case "step":
      return <FlowSvgStepDesc {...data} {...bindProps} />;
    case "end":
      return <FlowSvgEndStep />;
    case "start":
      return <FlowSvgStepDesc startFlag {...data} {...bindProps} />;
    case "transfer":
      return <FlowSvgTransfer {...data} {...bindProps} />;
    case "seq": {
      if (!isFlowSequence(data)) {
        return null;
      }
      return <FlowSvgSeq datas={data} bindProps={bindProps} />;
    }
    case "cond":
      return <FlowSvgCond {...data} {...bindProps} />;
    case "para":
      return <FlowSvgPara {...data} {...bindProps} />;
    default:
      return null;
  }
}

export type FlowRenderSvgProps = {
  datas?: FlowItem[];
  shrinksFactor?: number;
} & FlowSvgBindProps;

export function FlowRenderSvg({
  datas = [],
  shrinksFactor = 1,
  activeId,
  svgDomOnClick,
  idColorMap,
  greenArrowIds = [],
}: FlowRenderSvgProps) {
  const bindProps: FlowSvgBindProps = {
    activeId,
    svgDomOnClick,
    idColorMap,
    greenArrowIds,
  };

  const x =
    Math.max(...datas.map((item) => getFlowWidth(item)), 0) + FLOW_ARROW_OFFSET;
  const y = datas
    .map((item) => getFlowHeight(item))
    .reduce((acc, cur) => acc + cur, 0);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      data-testid="flow-read-only-svg"
      transform={`scale(${shrinksFactor})`}
      style={{ transformOrigin: "0 0" }}
      width={x}
      height={y}
      className="text-foreground"
    >
      {datas.map((item, idx) => (
        <g
          key={idx}
          transform={`translate(${FLOW_ARROW_OFFSET}, ${getNewFlowY(y, idx, datas)})`}
        >
          {getFlowSvg(item, bindProps)}
        </g>
      ))}
    </svg>
  );
}
