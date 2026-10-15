import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FloorPlanShell } from "./floor-plan-shell";
import { VALID_STANDARD_FLOOR_PLAN } from "@/lib/floor-plan/fixtures/valid-standard-plan";
import {
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
} from "@/lib/floor-plan/fixtures/standard-plans";
import { buildStandardPlanSummary } from "@/lib/floor-plan/catalog";

const FIXTURE_PLANS = [
  VALID_STANDARD_FLOOR_PLAN,
  STUDIO_STANDARD_FLOOR_PLAN,
  THREE_BED_STANDARD_FLOOR_PLAN,
].map((plan) => buildStandardPlanSummary(plan));

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

    // 2. Clean 'open-plan-selector-btn' is used to switch predefined plans
    expect(screen.getByTestId("open-plan-selector-btn")).toBeInTheDocument();

    // 3. No source-image upload or file input exists in floor plan shell
    expect(screen.queryByTestId("file-upload-input")).not.toBeInTheDocument();
    expect(screen.queryByText(/上传/i)).not.toBeInTheDocument();

    // 4. No CubiCasa text or recognition labels exist
    expect(screen.queryByText(/CubiCasa/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/智能识别/i)).not.toBeInTheDocument();
  });

  it("verifies preserved floor-plan viewing, furniture addition, movement, rotation, and basic collision feedback", async () => {
    render(<FloorPlanShell initialPlans={FIXTURE_PLANS} locale="zh" isMobile={false} />);

    // 1. Floor plan viewer is present
    expect(screen.getByTestId("floor-plan-viewer-surface")).toBeInTheDocument();

    // 2. Select room r1
    fireEvent.click(screen.getByTestId("room-item-r1"));

    // 3. Add furniture from context palette
    const addBtns = screen.getAllByTestId(/^add-context-furniture-/);
    expect(addBtns.length).toBeGreaterThan(0);
    fireEvent.click(addBtns[0]);

    // 4. Decision panel reached with basic spatial feedback
    await waitFor(() => {
      expect(screen.getByTestId("decision-target-furniture")).toBeInTheDocument();
    });
  });
});
