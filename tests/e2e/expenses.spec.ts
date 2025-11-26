import { test, expect } from "./fixtures/auth.fixture";

test("should allow to add new expense", async ({ expensesPage, page }) => {
  await expensesPage.createExpense("Test expense", "10", "Fun category");
  await expect(page.getByText("Test expense")).toBeAttached();
  await expect(page.getByText("10.00")).toBeAttached();
});

test("should allow to edit existing expense", async ({ expensesPage, page }) => {
  await expensesPage.createExpense("Test expense", "10", "Fun category");
  await expect(page.getByText("Test expense")).toBeAttached();

  await page.getByRole("link", { name: "Test expense" }).click();

  await expect(page.getByLabel("Description")).toHaveValue("Test expense");
  await expect(page.getByLabel("Amount")).toHaveValue("10");
  await expect(page.locator("#expense-form-category-select")).toHaveText("Fun category");

  await expensesPage.editExpense("Edited test expense", "20", "New category");

  await expect(page.getByText("Edited test expense")).toBeAttached();
  await expect(page.getByText("20.00")).toBeAttached();
});
