import { format } from "date-fns";
import { test, expect } from "./fixtures/auth.fixture";

test("should allow to add new expense", async ({ expensesPage, page }) => {
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category",
    date: {
      year: "2024",
      month: "Dec",
      day: "1"
    }
  });
  await expect(page.getByText("Test expense")).toBeAttached();
  await expect(page.getByText("10.00")).toBeAttached();
  await expect(page.getByText("Sun 1 Dec")).toBeAttached();
});

test("should allow to edit existing expense", async ({ expensesPage, page }) => {
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category",
    date: {
      year: "2024",
      month: "Dec",
      day: "1",
      time: "10:00"
    }
  });
  await expect(page.getByText("Test expense")).toBeAttached();
  await page.getByRole("link", { name: "Test expense" }).click();
  await expect(page.getByLabel("Description")).toHaveValue("Test expense");
  await expect(page.getByLabel("Amount")).toHaveValue("10");

  const datePickerButton = page.locator("#date-picker");
  await expect(datePickerButton).toHaveText("1 Dec 2024");
  await expect(page.locator("#expense-form-category-select")).toHaveText("Fun category");

  datePickerButton.click();
  await expect(page.locator("#time-picker")).toHaveValue("10:00");

  await expensesPage.editExpense({
    description: "Edited test expense",
    amount: "20",
    categoryName: "New category",
    date: {
      year: "2020",
      month: "Jun",
      day: "30"
    }
  });

  await expect(page.getByText("Edited test expense")).toBeAttached();
  await expect(page.getByText("20.00")).toBeAttached();
  await expect(page.getByText("Tue 30 Jun")).toBeAttached();
});

test("should allow to create future expense", async ({ expensesPage, page }) => {
  const nextDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await expensesPage.createExpense({
    description: "Future expense",
    amount: "10",
    categoryName: "Fun category",
    date: {
      year: format(nextDay, "yyyy"),
      month: format(nextDay, "MMM"),
      day: format(nextDay, "d")
    }
  });

  await expect(page.getByText("Upcoming")).toBeAttached();
  await expect(page.getByText("Future expense")).toBeAttached();
  await expect(page.getByText("10.00")).toBeAttached();
  await expect(page.getByText(format(nextDay, "d MMM"))).toBeAttached();
});

test("should allow to delete expense", async ({ expensesPage, page }) => {
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category"
  });

  await expensesPage.deleteExpense("Test expense");
  await expect(page.getByText("No entries found.")).toBeAttached();
});
