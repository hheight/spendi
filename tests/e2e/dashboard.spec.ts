import { test, expect } from "./fixtures/auth.fixture";

test.describe("Dashboard page", () => {
  test("should show list of monthly expenses", async ({ page, expensesPage }) => {
    await expensesPage.goto();

    await expensesPage.createExpense({
      description: "Dec 1 expense",
      amount: "10",
      categoryName: "Fun category",
      date: {
        year: "2025",
        month: "Dec",
        day: "1"
      }
    });

    await expect(page.getByText("10.00")).toBeAttached();

    await expensesPage.createExpense({
      description: "Dec 2 expense",
      amount: "100",
      categoryName: "Fun category",
      date: {
        year: "2025",
        month: "Dec",
        day: "2"
      }
    });

    await expect(page.getByText("100.00")).toBeAttached();

    await expensesPage.createExpense({
      description: "Nov 1 expense",
      amount: "200",
      categoryName: "Fun category",
      date: {
        year: "2025",
        month: "Nov",
        day: "1"
      }
    });

    await expensesPage.createExpense({
      description: "Nov 2 expense",
      amount: "30",
      categoryName: "Fun category",
      date: {
        year: "2025",
        month: "Nov",
        day: "2"
      }
    });

    await expect(page.getByText("100.00")).toBeAttached();
    await page.goto("/dashboard");

    const monthSelectTrigger = page.locator("#month-select-trigger");
    await monthSelectTrigger.click();
    await page.getByRole("option", { name: "Dec 2025" }).click();

    await expect(page.getByText("110.00")).toBeAttached();
    await expect(page.getByText("Dec 2 expense")).toBeAttached();
    await expect(page.getByText("Dec 1 expense")).toBeAttached();
    await expect(page.getByText("Nov 2 expense")).not.toBeAttached();
    await expect(page.getByText("Nov 1 expense")).not.toBeAttached();

    await monthSelectTrigger.click();
    await page.getByRole("option", { name: "Nov 2025" }).click();

    await expect(page.getByText("230.00")).toBeAttached();
    await expect(page.getByText("Dec 2 expense")).not.toBeAttached();
    await expect(page.getByText("Dec 1 expense")).not.toBeAttached();
    await expect(page.getByText("Nov 2 expense")).toBeAttached();
    await expect(page.getByText("Nov 1 expense")).toBeAttached();
  });
});
