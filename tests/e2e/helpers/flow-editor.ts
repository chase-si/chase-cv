import { expect, type Locator, type Page } from "@playwright/test";

export const DEMO_STEP_NODE_ID = "step001";
export const DEMO_STEP_DESC = "desc1";
export const DEMO_TRANSFER_NODE_ID = "transfer001";

export function flowCanvas(page: Page): Locator {
  return page.getByTestId("flow-editor-canvas");
}

export function flowProperties(page: Page): Locator {
  return page.getByTestId("flow-editor-properties");
}

export function flowToolbar(page: Page): Locator {
  return page.getByTestId("flow-editor-toolbar");
}

export async function openFlowEditor(page: Page): Promise<void> {
  await page.goto("/flow");
  await expect(page).toHaveURL(/\/flow$/);
  await expect(page.getByRole("heading", { level: 1, name: "流程编辑器" })).toBeVisible();
  await expect(flowCanvas(page).getByTestId("flow-read-only-svg")).toBeVisible();
}

export async function navigateToFlowEditorFromHome(page: Page): Promise<void> {
  await page.goto("/");
  await expect(page).toHaveURL(/\/$/);
  const nav = page.getByRole("navigation", { name: "Primary navigation" });
  await nav.getByRole("button", { name: "Projects" }).click();
  await nav.getByRole("menuitem", { name: /Flow Editor/ }).click();
  await expect(page).toHaveURL(/\/flow$/);
}

export async function openFlowEditorZh(page: Page): Promise<void> {
  await page.goto("/zh/flow");
  await expect(page).toHaveURL(/\/zh\/flow$/);
  await expect(page.getByRole("heading", { level: 1, name: "流程编辑器" })).toBeVisible();
  await expect(flowCanvas(page).getByTestId("flow-read-only-svg")).toBeVisible();
}

export async function selectFlowNode(page: Page, nodeId: string): Promise<void> {
  const node = flowCanvas(page).locator(`[data-flow-node-id="${nodeId}"]`);
  await expect(node).toBeVisible();
  await node.click();
  await expect(flowProperties(page).getByTestId("flow-properties-form")).toBeVisible();
  await expect(flowProperties(page)).toContainText(nodeId);
}
