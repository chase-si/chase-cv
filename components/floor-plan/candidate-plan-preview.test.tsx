import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import { STUDIO_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import FloorPlanLabPage from "@/app/[locale]/floor-plan/lab/page";
import {
  CandidatePlanPreview,
  prepareCandidatePlanForRender,
} from "./candidate-plan-preview";

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn().mockImplementation(async () => (key: string) => key),
}));

class MockResizeObserver {
  observe(el: Element) {
    this.callback([
      {
        contentRect: { width: 800, height: 600 },
        target: el,
      },
    ]);
  }
  unobserve() {}
  disconnect() {}
  constructor(private callback: (entries: any[]) => void) {}
}

vi.stubGlobal("ResizeObserver", MockResizeObserver);

const FIXTURE_PLANS = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
].map((plan) => buildStandardPlanSummary(plan));

afterEach(() => {
  cleanup();
});

describe("CandidatePlanPreview & Render Adapter (AC-15, AC-16, AC-17, AC-18)", () => {
  let writeTextMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: writeTextMock },
      configurable: true,
    });
  });

  it("render adapter accepts valid candidate plan and normalizes StandardFloorPlan structure without mutating topology (AC-16)", () => {
    const rawJson = JSON.stringify(VALID_STANDARD_FLOOR_PLAN, null, 2);
    const result = prepareCandidatePlanForRender(rawJson);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.version).toBe(1);
      expect(result.value.unit).toBe("mm");
      expect(result.value.meta.isStandard).toBe(true);
      expect(result.value.meta.source).toBe("template");
      expect(result.value.rooms[0].boundaryWallIds).toEqual(
        VALID_STANDARD_FLOOR_PLAN.rooms[0].boundaryWallIds,
      );
    }
  });

  it("render adapter rejects shuffled or unclosed room boundaries without reordering or repairing topology (AC-15, AC-16)", () => {
    const shuffledCandidate = {
      ...VALID_STANDARD_FLOOR_PLAN,
      rooms: [
        {
          ...VALID_STANDARD_FLOOR_PLAN.rooms[0],
          boundaryWallIds: ["w1", "w5", "w7", "w6"], // non-consecutive walls
        },
        VALID_STANDARD_FLOOR_PLAN.rooms[1],
      ],
    };

    const result = prepareCandidatePlanForRender(
      JSON.stringify(shuffledCandidate),
    );
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(
        result.errors.some(
          (e) =>
            e.path === "rooms[0].boundaryWallIds[1]" &&
            e.message.includes("r1"),
        ),
      ).toBe(true);
    }
  });

  it("renders valid candidate floor plan on SVG canvas and copies final formatted JSON (AC-16, AC-17)", async () => {
    render(<CandidatePlanPreview initialPlans={FIXTURE_PLANS} locale="zh" />);

    // Valid status and SVG preview rendered
    expect(screen.getByTestId("candidate-validation-status")).toHaveTextContent(
      /验证通过|Valid/i,
    );
    expect(screen.getByTestId("candidate-plan-svg-preview")).toBeInTheDocument();
    expect(screen.getByTestId("floor-plan-room-r1")).toBeInTheDocument();
    expect(screen.queryByTestId("candidate-validation-errors")).not.toBeInTheDocument();

    // Switch preset template to Studio plan
    const presetSelect = screen.getByTestId("candidate-preset-select");
    fireEvent.change(presetSelect, {
      target: { value: "floor-plan-std-studio-01" },
    });

    expect(screen.getByTestId("floor-plan-room-sr1")).toBeInTheDocument();

    // Copy final JSON
    const copyBtn = screen.getByTestId("copy-final-json-btn");
    expect(copyBtn).not.toBeDisabled();
    fireEvent.click(copyBtn);

    await waitFor(() => {
      expect(writeTextMock).toHaveBeenCalledTimes(1);
    });
    const copiedText = writeTextMock.mock.calls[0][0];
    const parsedCopied = JSON.parse(copiedText);
    expect(parsedCopied.meta.id).toBe("floor-plan-std-studio-01");
    expect(parsedCopied.meta.isStandard).toBe(true);
    expect(parsedCopied.meta.source).toBe("template");
    expect(screen.getByTestId("copy-final-json-status")).toHaveTextContent(
      /已复制|Copied/i,
    );
  });

  it("refuses to render SVG canvas when candidate JSON fails validation and displays field/object errors (AC-15, AC-16, AC-17)", () => {
    render(<CandidatePlanPreview initialPlans={FIXTURE_PLANS} locale="zh" />);

    const editor = screen.getByTestId("candidate-json-editor");

    // Paste candidate plan with unclosed room r1 and oversized opening win1
    const invalidCandidate = {
      ...VALID_STANDARD_FLOOR_PLAN,
      openings: [
        {
          ...VALID_STANDARD_FLOOR_PLAN.openings[0],
          width: 4500, // exceeds w1 length 3000mm
        },
      ],
      rooms: [
        {
          ...VALID_STANDARD_FLOOR_PLAN.rooms[0],
          boundaryWallIds: ["w1", "w7", "w5"], // missing closing wall w6
        },
        VALID_STANDARD_FLOOR_PLAN.rooms[1],
      ],
    };

    fireEvent.change(editor, {
      target: { value: JSON.stringify(invalidCandidate, null, 2) },
    });

    // Strict Render Guard (AC-16): SVG canvas MUST NOT render
    expect(
      screen.queryByTestId("candidate-plan-svg-preview"),
    ).not.toBeInTheDocument();

    // Validation errors panel must be shown with field path and object ID (AC-15, AC-17)
    const errorPanel = screen.getByTestId("candidate-validation-errors");
    expect(errorPanel).toBeInTheDocument();
    expect(errorPanel).toHaveTextContent("openings[0].width");
    expect(errorPanel).toHaveTextContent("win1");
    expect(errorPanel).toHaveTextContent("rooms[0].boundaryWallIds");
    expect(errorPanel).toHaveTextContent("r1");

    // Copy Final JSON button is disabled when invalid
    expect(screen.getByTestId("copy-final-json-btn")).toBeDisabled();
  });

  it("displays the visible Human Semantic Review Checklist and explicit non-automation disclaimer (AC-18)", () => {
    render(<CandidatePlanPreview initialPlans={FIXTURE_PLANS} locale="zh" />);

    const checklist = screen.getByTestId("human-semantic-checklist");
    expect(checklist).toBeInTheDocument();

    // 3 approved human semantic items
    expect(checklist).toHaveTextContent("门窗朝向与内墙检查");
    expect(checklist).toHaveTextContent(
      "确认窗户位于外墙或合理采光面，未误开在室内分隔墙上。",
    );
    expect(checklist).toHaveTextContent("房间功能关系检查");
    expect(checklist).toHaveTextContent(
      "确认卧室、卫生间、厨房、客餐厅的相邻与入户关系符合居住常识。",
    );
    expect(checklist).toHaveTextContent("基本生活动线检查");
    expect(checklist).toHaveTextContent(
      "确认从入户门到各房间存在合理可通行门洞，无死角房间。",
    );

    // Explicit disclaimer
    const disclaimer = screen.getByTestId("human-semantic-disclaimer");
    expect(disclaimer).toHaveTextContent(
      "系统仅验证基础几何与拓扑闭合，不自动批准、拒绝或修复上述空间语义问题，由维护者根据渲染结果人工复核。",
    );

    // Toggling human checklist item does not alter candidate JSON
    const editor = screen.getByTestId("candidate-json-editor") as HTMLTextAreaElement;
    const beforeValue = editor.value;
    const check1 = screen.getByTestId("semantic-check-item-1");
    fireEvent.click(check1);
    expect(editor.value).toBe(beforeValue);
  });

  it("mounts CandidatePlanPreview at /floor-plan/lab route (AC-17, AC-18)", async () => {
    const pageJsx = await FloorPlanLabPage({
      params: Promise.resolve({ locale: "zh" }),
    });
    render(pageJsx);

    expect(screen.getByTestId("candidate-plan-preview")).toBeInTheDocument();
    expect(screen.getByTestId("human-semantic-checklist")).toBeInTheDocument();
    expect(screen.getByTestId("copy-final-json-btn")).toBeInTheDocument();
  });
});
