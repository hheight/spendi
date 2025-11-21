import { test, expect } from "./fixtures/auth.fixture";

test.describe("income", () => {
  test("should allow to save income", async ({ authenticatedPage: page }) => {
    await page.getByRole("link", { name: "Income" }).click();

    const input = page.locator("input[name=income]");
    await expect(input).toHaveValue("0");
    await input.fill("2000");

    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    await expect(saveButton).not.toBeDisabled();

    await page.reload();

    await expect(input).toHaveValue("2000");
  });
});
