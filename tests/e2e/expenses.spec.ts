import { test, expect } from "./fixtures/auth.fixture";

test.describe("expenses", () => {
  test("should allow to add new expense", async ({ authenticatedPage: page }) => {
    await page.getByRole("link", { name: "adding expenses" }).click();

    await page.getByLabel("Description").fill("Test expense");
    await page.getByLabel("Amount").fill("10");
    await page.getByLabel("Create new category").click();
    await page.getByLabel("Name").fill("New category");

    const saveButton = page.getByRole("button", { name: "Save" });
    await saveButton.click();
    await expect(saveButton).not.toBeDisabled();

    await expect(page.getByText("Test expense")).toBeAttached();
  });
});
