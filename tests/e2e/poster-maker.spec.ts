import { expect, test } from "@playwright/test";

test.describe("poster maker navigation", () => {
  test("opens the poster maker workbench from the top navigation", async ({
    page,
  }) => {
    await page.goto("/");

    await page.getByRole("button", { name: "模板图片" }).click();

    await expect(page).toHaveURL(/\/poster-maker$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Poster Maker" }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Poster maker workbench" }),
    ).toBeVisible();
  });
});
