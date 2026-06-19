import { expect, test } from "@playwright/test";

import {
  DEMO_STEP_DESC,
  DEMO_STEP_NODE_ID,
  DEMO_TRANSFER_NODE_ID,
  flowCanvas,
  flowProperties,
  flowToolbar,
  navigateToFlowEditorFromHome,
  openFlowEditor,
  openFlowEditorZh,
  selectFlowNode,
} from "./helpers/flow-editor";

test.describe("flow editor e2e", () => {
  test("case 1: navigation opens the flow editor page", async ({ page }) => {
    await navigateToFlowEditorFromHome(page);
    await expect(page.getByRole("heading", { level: 1, name: "流程编辑器" })).toBeVisible();
    await expect(flowCanvas(page).getByTestId("flow-read-only-surface")).toBeVisible();
    await expect(flowCanvas(page).getByTestId("flow-read-only-svg")).toBeVisible();
    await expect(flowProperties(page).getByTestId("flow-properties-empty")).toBeVisible();
    await expect(flowProperties(page)).toContainText("尚未选中节点");
  });

  test("case 1b: Chinese locale route serves flow editor", async ({ page }) => {
    await openFlowEditorZh(page);
    await expect(
      page.getByRole("navigation").getByRole("button", { name: "流程编辑器" }),
    ).toBeVisible();
  });

  test("case 2: select a demo step and edit its visible description", async ({ page }) => {
    await openFlowEditor(page);

    await selectFlowNode(page, DEMO_STEP_NODE_ID);

    const descField = flowProperties(page).getByLabel("描述");
    await expect(descField).toHaveValue(DEMO_STEP_DESC);

    const editedDesc = "e2e-live-description";
    await descField.fill(editedDesc);

    await expect(descField).toHaveValue(editedDesc);
    await expect(flowCanvas(page)).toContainText(editedDesc);
    await expect(
      flowCanvas(page).locator(`[data-flow-node-id="${DEMO_STEP_NODE_ID}"]`),
    ).toHaveAttribute("data-flow-selected", "true");
    await expect(page).toHaveURL(/\/flow$/);
  });

  test("case 3: toolbar add sequential step creates an editable step", async ({ page }) => {
    await openFlowEditor(page);

    await selectFlowNode(page, DEMO_TRANSFER_NODE_ID);

    await flowToolbar(page).getByRole("button", { name: "增加顺序步" }).click();

    const properties = flowProperties(page);
    await expect(properties.getByTestId("flow-properties-form")).toBeVisible();
    await expect(properties.getByTestId("flow-properties-empty")).toHaveCount(0);

    const selectedNode = flowCanvas(page).locator('[data-flow-selected="true"]');
    await expect(selectedNode).toBeVisible();
    const newNodeId = await selectedNode.getAttribute("data-flow-node-id");
    expect(newNodeId).toBeTruthy();
    expect(newNodeId).not.toBe(DEMO_TRANSFER_NODE_ID);
    await expect(properties).toContainText(newNodeId!);

    const numberField = properties.getByLabel("编号");
    await expect(numberField).toBeEditable();
    const numberValue = await numberField.inputValue();
    expect(numberValue).toMatch(/^\d{3}$/);
  });

  test("case 4: running-state highlight toggle affects display only", async ({ page }) => {
    await openFlowEditor(page);

    const highlightSwitch = page.getByRole("switch", { name: "运行态高亮" });
    await highlightSwitch.click();
    await expect(highlightSwitch).toHaveAttribute("aria-checked", "true");

    await expect(
      flowCanvas(page).locator('[data-flow-green-arrow="step003"]'),
    ).toBeVisible();

    await selectFlowNode(page, DEMO_STEP_NODE_ID);

    const editedDesc = "highlight-edit-e2e";
    await flowProperties(page).getByLabel("描述").fill(editedDesc);

    await expect(flowCanvas(page)).toContainText(editedDesc);
    await expect(
      flowCanvas(page).locator(`[data-flow-node-id="${DEMO_STEP_NODE_ID}"]`),
    ).toHaveAttribute("data-flow-selected", "true");
  });

  test("case 5: reset restores demo data but keeps highlight preference", async ({ page }) => {
    await openFlowEditor(page);

    await selectFlowNode(page, DEMO_STEP_NODE_ID);
    await flowProperties(page).getByLabel("描述").fill("mutated-before-reset");

    const highlightSwitch = page.getByRole("switch", { name: "运行态高亮" });
    await highlightSwitch.click();
    await expect(highlightSwitch).toHaveAttribute("aria-checked", "true");

    await page.getByTestId("flow-demo-reset").click();

    await expect(flowProperties(page).getByTestId("flow-properties-empty")).toBeVisible();
    await expect(flowCanvas(page)).toContainText(DEMO_STEP_DESC);
    await expect(flowCanvas(page)).not.toContainText("mutated-before-reset");
    await expect(highlightSwitch).toHaveAttribute("aria-checked", "true");
  });
});
