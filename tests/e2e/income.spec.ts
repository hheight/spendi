import { test, expect } from "./fixtures/auth.fixture";

test.describe("income", () => {
  test("should allow to save income", async ({ incomePage, page }) => {
    const input = page.locator("#income-form-input");
    await expect(input).toHaveValue("0");

    await incomePage.editIncome("2000");

    await page.reload();

    await expect(input).toHaveValue("2000");
  });
});
