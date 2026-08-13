import { expect, test } from "@playwright/test";

const DUDU_SCANNER_PATH = "/en/dudu-scanner";

test.describe("dudu scanner desktop setup", () => {
  for (const viewport of [
    { width: 1280, height: 720 },
    { width: 1366, height: 768 },
    { width: 1440, height: 900 },
  ]) {
    test(`fits setup without scrollbars at ${viewport.width}x${viewport.height}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(DUDU_SCANNER_PATH);

      const appRoot = page.getByTestId("dudu-scanner-app-root");
      const howToPlay = page.getByTestId("dudu-scanner-how-to-play");
      const shortcutsCard = page
        .getByText("Operator shortcuts", { exact: true })
        .locator("xpath=ancestor::*[@data-slot='card'][1]");
      const shortcutsContent = shortcutsCard.locator('[data-slot="card-content"]');

      await expect(howToPlay).toBeVisible();
      await expect(shortcutsCard).toBeAttached();

      const layout = await appRoot.evaluate((root) => {
        const main = root.querySelector("main");
        const shortcutsTitle = Array.from(
          root.querySelectorAll<HTMLElement>('[data-slot="card-title"]'),
        ).find((element) => element.textContent?.includes("Operator shortcuts"));
        const shortcuts = shortcutsTitle?.closest<HTMLElement>('[data-slot="card"]');
        const content = shortcuts?.querySelector<HTMLElement>('[data-slot="card-content"]');

        return {
          hasHorizontalOverflow: root.scrollWidth > root.clientWidth + 1,
          rootHasVerticalOverflow: root.scrollHeight > root.clientHeight + 1,
          mainHasVerticalOverflow: Boolean(main && main.scrollHeight > main.clientHeight + 1),
          shortcutsContentIsClipped: Boolean(
            shortcuts &&
              content &&
              content.getBoundingClientRect().bottom > shortcuts.getBoundingClientRect().bottom + 1,
          ),
        };
      });

      expect(layout.hasHorizontalOverflow).toBe(false);
      expect(layout.rootHasVerticalOverflow).toBe(false);
      expect(layout.mainHasVerticalOverflow).toBe(false);
      expect(layout.shortcutsContentIsClipped).toBe(false);

      await shortcutsContent.scrollIntoViewIfNeeded();
      await expect(shortcutsContent).toBeVisible();

      await page.getByRole("button", { name: "Operator mode" }).click();
      await expect(page.getByRole("button", { name: "Breakfast Wake-up Bird" })).toBeVisible();

      const operatorOverflow = await appRoot.evaluate((root) => {
        const main = root.querySelector("main");
        return {
          horizontal: root.scrollWidth > root.clientWidth + 1,
          rootVertical: root.scrollHeight > root.clientHeight + 1,
          mainVertical: Boolean(main && main.scrollHeight > main.clientHeight + 1),
        };
      });

      expect(operatorOverflow).toEqual({
        horizontal: false,
        rootVertical: false,
        mainVertical: false,
      });
    });
  }
});
