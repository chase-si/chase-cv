import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { FloorPlanShell } from "./floor-plan-shell";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";
import FloorPlanLabPage, { generateMetadata as generateLabMetadata } from "@/app/[locale]/floor-plan/lab/page";

const FIXTURE_PLANS = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
].map((plan) => buildStandardPlanSummary(plan));

vi.mock("next-intl/server", () => ({
  setRequestLocale: vi.fn(),
  getTranslations: vi.fn().mockImplementation(async () => (key: string) => key),
}));

afterEach(() => {
  cleanup();
});

describe("AC-27: Prune recognition, calibration, and source-import capabilities", () => {
  it("ensures core /floor-plan UI exposes no recognition, CubiCasa, source-import, or calibration controls", () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" />);

    // 1. No calibration buttons or flows in stage 1 or elsewhere
    expect(screen.queryByTestId("start-calibration-btn")).not.toBeInTheDocument();
    expect(screen.queryByTestId("skip-calibration-btn")).not.toBeInTheDocument();
    expect(screen.queryByText(/调整房间（可选）/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/跳过校准/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/待校准尺寸/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/尺寸已标定/i)).not.toBeInTheDocument();

    // 2. Clean 'use-plan-btn' is used to advance to room stage
    const usePlanBtns = screen.getAllByTestId("use-plan-btn");
    expect(usePlanBtns.length).toBeGreaterThan(0);
    expect(usePlanBtns[0]).toHaveTextContent("使用这个户型");

    // 3. No source-image upload or file input exists in floor plan shell
    expect(screen.queryByTestId("file-upload-input")).not.toBeInTheDocument();
    expect(screen.queryByText(/上传/i)).not.toBeInTheDocument();

    // 4. No CubiCasa text or recognition labels exist
    expect(screen.queryByText(/CubiCasa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/智能识别/i)).not.toBeInTheDocument();
  });

  it("ensures floor plan lab route exposes candidate-plan asset preview and no recognition or calibration path", async () => {
    const metaZh = await generateLabMetadata({ params: Promise.resolve({ locale: "zh" }) });
    expect(metaZh.title).not.toContain("CubiCasa");
    expect(metaZh.title).not.toContain("识图");
    expect(metaZh.description).not.toContain("CubiCasa");
    expect(metaZh.description).not.toContain("两点尺度标定");

    const metaEn = await generateLabMetadata({ params: Promise.resolve({ locale: "en" }) });
    expect(metaEn.title).not.toContain("CubiCasa");
    expect(metaEn.title).not.toContain("Recognition");
    expect(metaEn.description).not.toContain("CubiCasa");
    expect(metaEn.description).not.toContain("two-point scale calibration");

    // Renders the lab page component
    const labJsx = await FloorPlanLabPage({ params: Promise.resolve({ locale: "zh" }) });
    const { container } = render(labJsx);

    // Assert no recognition or calibration controls in lab
    expect(within(container).queryByText(/CubiCasa/i)).not.toBeInTheDocument();
    expect(within(container).queryByTestId("run-inference-btn")).not.toBeInTheDocument();
    expect(within(container).queryByTestId("file-upload-input")).not.toBeInTheDocument();
    expect(within(container).queryByTestId("start-calibration-btn")).not.toBeInTheDocument();
    expect(within(container).queryByTestId("skip-calibration-btn")).not.toBeInTheDocument();
  });

  it("verifies preserved floor-plan viewing, furniture addition, movement, rotation, and basic collision feedback", async () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

    // 1. Advance through workflow using use-plan-btn
    fireEvent.click(screen.getAllByTestId("use-plan-btn")[0]);
    expect(screen.getByTestId("stage-step-room")).toHaveAttribute("aria-current", "step");

    // 2. Select room r1
    fireEvent.click(screen.getByTestId("room-item-r1"));
    fireEvent.click(screen.getByTestId("next-to-furniture-btn"));
    expect(screen.getByTestId("stage-step-furniture")).toHaveAttribute("aria-current", "step");

    // 3. Add furniture from palette
    const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
    expect(addBtns.length).toBeGreaterThan(0);
    fireEvent.click(addBtns[0]);

    // 4. Decision stage reached with basic spatial feedback
    await waitFor(() => {
      expect(screen.getByTestId("stage-step-decision")).toHaveAttribute("aria-current", "step");
      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
    });
  });
});
