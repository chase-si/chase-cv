import { describe, expect, it } from "vitest";
import { VALID_STANDARD_FLOOR_PLAN } from "./fixtures";
import type { FloorPlan } from "./types";
import type { RuleResult } from "./rules/types";
import {
  summarizeFurnitureDecision,
  type FurnitureDecisionStatus,
} from "./furniture-decision";

describe("Furniture Decision Summary (US-13, US-14, US-17, US-20, AC-14, AC-15, AC-16)", () => {
  const getTestPlan = (): FloorPlan => JSON.parse(JSON.stringify(VALID_STANDARD_FLOOR_PLAN));

  describe("AC-14: Four Mutually Exclusive Statuses & Priority", () => {
    it("returns 'unavailable' for uncalibrated/unscaled floor plans without implying clearance passes", () => {
      const plan = getTestPlan();
      plan.meta.unscaled = true;

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        locale: "zh",
      });

      expect(summary.status).toBe<FurnitureDecisionStatus>("unavailable");
      expect(summary.statusLabel).toBe("暂无法判断");
      expect(summary.uncalibrated).toBe(true);
      // AC-14 & AC-15: Must not imply real-world clearance passed
      expect(summary.summary).toContain("未标定");
      expect(summary.summary).not.toContain("净距已通过");
    });

    it("returns 'unavailable' in English locale for uncalibrated plan", () => {
      const plan = getTestPlan();
      plan.meta.unscaled = true;

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        locale: "en",
      });

      expect(summary.status).toBe<FurnitureDecisionStatus>("unavailable");
      expect(summary.statusLabel).toBe("Unavailable");
      expect(summary.summary.toLowerCase()).toContain("uncalibrated");
    });

    it("returns 'not-recommended' when target furniture has relevant error", () => {
      const plan = getTestPlan();
      const ruleResults: RuleResult[] = [
        {
          ruleId: "furniture-boundary",
          severity: "error",
          relatedEntityIds: ["f2"],
          relatedObjectIds: ["f2"],
          measuredValue: 150,
          recommendedValue: "Inside room",
          title: "Boundary Violation",
          message: 'Furniture "f2" is placed outside room boundaries.',
        },
      ];

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults,
        locale: "zh",
      });

      expect(summary.status).toBe<FurnitureDecisionStatus>("not-recommended");
      expect(summary.statusLabel).toBe("不建议");
      expect(summary.relevantIssues).toHaveLength(1);
      expect(summary.relevantIssues[0].ruleId).toBe("furniture-boundary");
    });

    it("returns 'caution' when target furniture has only warnings and no errors", () => {
      const plan = getTestPlan();
      const ruleResults: RuleResult[] = [
        {
          ruleId: "furniture-clearance",
          severity: "warning",
          relatedEntityIds: ["f2", "f1"],
          relatedObjectIds: ["f2", "f1"],
          measuredValue: 450,
          recommendedValue: 600,
          title: "Furniture Clearance",
          message: "Clearance between furniture items is less than recommended.",
        },
      ];

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults,
        locale: "zh",
      });

      expect(summary.status).toBe<FurnitureDecisionStatus>("caution");
      expect(summary.statusLabel).toBe("需要权衡");
      expect(summary.relevantIssues).toHaveLength(1);
      expect(summary.relevantIssues[0].severity).toBe("warning");
    });

    it("returns 'suitable' when no rule violations affect target furniture", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults: [],
        locale: "zh",
      });

      expect(summary.status).toBe<FurnitureDecisionStatus>("suitable");
      expect(summary.statusLabel).toBe("适合");
      expect(summary.relevantIssues).toHaveLength(0);
    });

    it("filters out violations from other furniture so they do not degrade target furniture verdict", () => {
      const plan = getTestPlan();
      // f1 has an error, but target is f2
      const ruleResults: RuleResult[] = [
        {
          ruleId: "furniture-boundary",
          severity: "error",
          relatedEntityIds: ["f1"],
          relatedObjectIds: ["f1"],
          measuredValue: 200,
          recommendedValue: "Inside room",
          title: "Boundary Violation",
          message: 'Furniture "f1" is outside room boundaries.',
        },
        {
          ruleId: "furniture-clearance",
          severity: "warning",
          relatedEntityIds: ["f1"],
          relatedObjectIds: ["f1"],
          measuredValue: 300,
          recommendedValue: 600,
          title: "Clearance Warning",
          message: 'Furniture "f1" clearance is tight.',
        },
      ];

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults,
        locale: "zh",
      });

      // Target f2 has no violations, so it should still be 'suitable'
      expect(summary.status).toBe<FurnitureDecisionStatus>("suitable");
      expect(summary.relevantIssues).toHaveLength(0);
      expect(summary.totalViolationsCount).toBe(2);
    });

    it("enforces priority: uncalibrated over error, and error over warning", () => {
      const plan = getTestPlan();
      plan.meta.unscaled = true;

      const ruleResults: RuleResult[] = [
        {
          ruleId: "furniture-wall-collision",
          severity: "error",
          relatedEntityIds: ["f2", "w3"],
          relatedObjectIds: ["f2", "w3"],
          measuredValue: 500,
          recommendedValue: "0 mm²",
          title: "Wall Collision",
          message: 'Collision with wall.',
        },
      ];

      // Uncalibrated plan must be 'unavailable' even if error exists
      const summaryUncalibrated = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults,
        locale: "zh",
      });
      expect(summaryUncalibrated.status).toBe("unavailable");

      // Calibrated plan with both error and warning -> 'not-recommended'
      plan.meta.unscaled = false;
      const ruleResultsBoth: RuleResult[] = [
        ...ruleResults,
        {
          ruleId: "furniture-clearance",
          severity: "warning",
          relatedEntityIds: ["f2"],
          relatedObjectIds: ["f2"],
          measuredValue: 400,
          recommendedValue: 600,
          title: "Clearance Warning",
          message: "Clearance warning.",
        },
      ];

      const summaryBoth = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults: ruleResultsBoth,
        locale: "zh",
      });
      expect(summaryBoth.status).toBe("not-recommended");
    });
  });

  describe("AC-15: Explicit Room, Furniture Name, Dimensions & Qualified Wording", () => {
    it("includes room name, furniture name, width and depth (mm) in title and summary", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults: [],
        locale: "zh",
      });

      // Target room name: "Master Bedroom" (or translated)
      expect(summary.roomName).toBeTruthy();
      // Target furniture name: "标准双人床" (definition bed-double)
      expect(summary.furnitureName).toBeTruthy();
      // Dimensions: 1800 × 2000 mm
      expect(summary.dimensions).toEqual({
        widthMm: 1800,
        depthMm: 2000,
        formatted: "1800 × 2000 mm",
      });

      expect(summary.title).toContain(summary.roomName);
      expect(summary.title).toContain(summary.furnitureName);
      expect(summary.title).toContain("1800");
      expect(summary.title).toContain("2000");

      expect(summary.summary).toContain(summary.roomName);
      expect(summary.summary).toContain(summary.furnitureName);
      expect(summary.summary).toContain("1800");
      expect(summary.summary).toContain("2000");
    });

    it("uses qualified expression '当前规则未发现问题' for suitable and includes non-guarantee disclaimer", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults: [],
        locale: "zh",
      });

      expect(summary.status).toBe("suitable");
      expect(summary.summary).toContain("当前规则未发现问题");
      // Disclaimer ensures advice is not construed as construction/safety guarantee
      expect(summary.disclaimer).toContain("不构成施工");
      expect(summary.disclaimer).toContain("安全保证");
    });

    it("provides accurate English wording without promising construction/safety guarantee", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults: [],
        locale: "en",
      });

      expect(summary.status).toBe("suitable");
      expect(summary.summary.toLowerCase()).toContain("no issues found under current rules");
      expect(summary.disclaimer.toLowerCase()).toContain("not constitute");
      expect(summary.disclaimer.toLowerCase()).toContain("guarantee");
    });
  });

  describe("AC-16: Issue Details with Measured and Recommended Values", () => {
    it("formats relevant issues with readable message, measuredValueMm and recommendedValueMm", () => {
      const plan = getTestPlan();
      const ruleResults: RuleResult[] = [
        {
          ruleId: "furniture-clearance",
          severity: "warning",
          relatedEntityIds: ["f2", "f1"],
          relatedObjectIds: ["f2", "f1"],
          measuredValue: 480,
          recommendedValue: 600,
          title: "Furniture Clearance",
          message: "Clearance between furniture items is 480 mm (recommended: 600 mm).",
        },
        {
          ruleId: "furniture-wall-collision",
          severity: "error",
          relatedEntityIds: ["f2", "w3"],
          relatedObjectIds: ["f2", "w3"],
          measuredValue: 1200,
          recommendedValue: "0 mm²",
          title: "Wall Collision",
          message: "Furniture intersects wall.",
        },
      ];

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        ruleResults,
        locale: "zh",
      });

      expect(summary.relevantIssues).toHaveLength(2);

      const clearanceIssue = summary.relevantIssues.find((i) => i.ruleId === "furniture-clearance")!;
      expect(clearanceIssue.measuredValue).toBe(480);
      expect(clearanceIssue.recommendedValue).toBe(600);
      expect(clearanceIssue.measuredFormatted).toBe("480 mm");
      expect(clearanceIssue.recommendedFormatted).toBe("600 mm");

      const collisionIssue = summary.relevantIssues.find((i) => i.ruleId === "furniture-wall-collision")!;
      expect(collisionIssue.measuredValue).toBe(1200);
      expect(collisionIssue.measuredFormatted).toBe("1200 mm²");
      expect(collisionIssue.recommendedFormatted).toBe("0 mm²");
    });
  });

  describe("Edge cases & graceful degradation", () => {
    it("handles missing targetFurnitureId gracefully", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: null,
        locale: "zh",
      });

      expect(summary.status).toBe("unavailable");
      expect(summary.hasTargetFurniture).toBe(false);
      expect(summary.dimensions).toBeNull();
    });

    it("evaluates plan rules automatically when ruleResults is not provided", () => {
      const plan = getTestPlan();

      const summary = summarizeFurnitureDecision({
        plan,
        targetRoomId: "r2",
        targetFurnitureId: "f2",
        locale: "zh",
      });

      expect(summary.status).toBeDefined();
      expect(summary.relevantIssues).toBeDefined();
    });
  });
});
