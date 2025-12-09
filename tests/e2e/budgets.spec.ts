import { test, expect } from "./fixtures/auth.fixture";
import { BudgetType } from "@/app/generated/prisma";

test("should allow to add overall budget", async ({ budgetsPage, page }) => {
  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100"
  });
  await expect(page.getByText("overall spent: 0%")).toBeAttached();
  await expect(page.getByText("100.00")).toBeAttached();
  await expect(page.getByText("left this month")).toBeAttached();
});

test("should allow to add category budget", async ({
  expensesPage,
  budgetsPage,
  page
}) => {
  await expensesPage.goto();
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category"
  });

  await expect(page.getByText("10.00")).toBeAttached();

  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100",
    category: "Fun category"
  });

  await expect(page.getByText("10% spent")).toBeAttached();
  await expect(page.getByText("90.00")).toBeAttached();
  await expect(page.getByText("left this month")).toBeAttached();
});

test("should allow to edit overall budget", async ({ budgetsPage, page }) => {
  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100"
  });
  await expect(page.getByText("100.00")).toBeAttached();

  await budgetsPage.editBudget({ amount: "200", type: BudgetType.OVERALL });

  await expect(page.getByText("200.00")).toBeAttached();
});

test("should allow to edit category budget", async ({
  budgetsPage,
  expensesPage,
  page
}) => {
  await expensesPage.goto();
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category"
  });

  await expect(page.getByText("10.00")).toBeAttached();

  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100",
    category: "Fun category"
  });

  await expect(page.getByText("90.00")).toBeAttached();
  await budgetsPage.editBudget({
    amount: "200",
    type: BudgetType.CATEGORY,
    category: "Fun category"
  });

  await expect(page.getByText("5% spent")).toBeAttached();
  await expect(page.getByText("190.00")).toBeAttached();
  await expect(page.getByText("left this month")).toBeAttached();
});

test("should show validation message when trying to create more than one overall budget", async ({
  budgetsPage,
  page
}) => {
  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100"
  });
  await expect(page.getByText("100.00")).toBeAttached();

  await budgetsPage.createBudget({
    amount: "200"
  });
  await expect(page.getByText("You already have an overall budget")).toBeAttached();
});

test("should show validation message when trying to create already existing category budget", async ({
  budgetsPage,
  expensesPage,
  page
}) => {
  await expensesPage.goto();
  await expensesPage.createExpense({
    description: "Test expense",
    amount: "10",
    categoryName: "Fun category"
  });

  await expect(page.getByText("10.00")).toBeAttached();

  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100",
    category: "Fun category"
  });

  await expect(page.getByText("90.00")).toBeAttached();
  await budgetsPage.createBudget({
    amount: "200",
    category: "Fun category"
  });

  await expect(page.getByText("Budget for this category already exists")).toBeAttached();
});

test("should allow to delete budget", async ({ budgetsPage, page }) => {
  await budgetsPage.goto();
  await budgetsPage.createBudget({
    amount: "100"
  });
  await expect(page.getByText("100.00")).toBeAttached();

  await budgetsPage.deleteBudget({ type: BudgetType.OVERALL });
  await expect(page.getByText("No entries found.")).toBeAttached();
});
