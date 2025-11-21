import { test, expect } from "./fixtures/auth.fixture";
import type { Page } from "@playwright/test";

test.describe("expenses", () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    await page.getByRole("link", { name: "adding expenses" }).click();
  });

  const createExpense = async (page: Page) => {
    await page.getByLabel("Description").fill("Test expense");
    await page.getByLabel("Amount").fill("10");
    await page.getByLabel("Create new category").click();
    await page.getByLabel("Name").fill("Fun category");

    await page.getByRole("button", { name: "Add" }).click();
  };

  test("should allow to add new expense", async ({ authenticatedPage: page }) => {
    await createExpense(page);
    await expect(page.getByText("Test expense")).toBeAttached();
    await expect(page.getByText("10.00")).toBeAttached();
  });

  test.only("should allow to edit existing expense", async ({
    authenticatedPage: page
  }) => {
    await createExpense(page);
    await expect(page.getByText("Test expense")).toBeAttached();

    await page.getByRole("link", { name: "Test expense" }).click();

    await expect(page.getByLabel("Description")).toHaveValue("Test expense");
    await expect(page.getByLabel("Amount")).toHaveValue("10");
    await expect(page.locator("#expense-form-category-select")).toHaveText(
      "Fun category"
    );

    await page.getByLabel("Description").fill("Edited test expense");
    await page.getByLabel("Amount").fill("20");
    await page.getByLabel("Create new category").click();
    await page.getByLabel("Name").fill("New category");

    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByText("Edited test expense")).toBeAttached();
    await expect(page.getByText("20.00")).toBeAttached();
  });
});
