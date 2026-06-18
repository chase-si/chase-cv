import { expect, test } from "@playwright/test";

import {
  DEMO_STEP_DESC,
  DEMO_STEP_NODE_ID,
  DEMO_TRANSFER_NODE_ID,
  flowCanvas,
  flowProperties,
  flowToolbar,
  navigateToFlowEditorFromHome,
  selectFlowNode,
} from "../helpers/flow-editor";

test.describe("flow editor journey", () => {
  test("smoke journey: navigate, edit, add step, reset", async ({ page }) => {
    await navigateToFlowEditorFromHome(page);

    await selectFlowNode(page, DEMO_STEP_NODE_ID);
    const journeyDesc = "journey-desc-e2e";
    await flowProperties(page).getByLabel("描述").fill(journeyDesc);
    await expect(flowCanvas(page)).toContainText(journeyDesc);

    await selectFlowNode(page, DEMO_TRANSFER_NODE_ID);
    await flowToolbar(page).getByRole("button", { name: "增加顺序步" }).click();
    await expect(flowProperties(page).getByTestId("flow-properties-form")).toBeVisible();

    await page.getByTestId("flow-demo-reset").click();
    await expect(flowProperties(page).getByTestId("flow-properties-empty")).toBeVisible();
    await expect(flowCanvas(page)).toContainText(DEMO_STEP_DESC);
    await expect(flowCanvas(page)).not.toContainText(journeyDesc);
  });
});
