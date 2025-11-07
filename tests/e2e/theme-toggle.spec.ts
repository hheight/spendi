import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("should toggle between light and dark mode", async ({ page }) => {
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).toHaveClass(/light/);

    const themeToggle = page.getByTitle("Toggle theme");
    // For some reason playwright ignores first click
    await themeToggle.dblclick();

    await expect(html).toHaveClass(/dark/);

    await themeToggle.click();

    await expect(html).toHaveClass(/light/);
  });

  test("should persist theme preference", async ({ page }) => {
    await page.goto("/");
    await page.getByTitle("Toggle theme").dblclick();

    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();

    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
