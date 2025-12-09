import { BudgetType } from "@/app/generated/prisma";
import { type Locator, type Page } from "@playwright/test";

export class BudgetsPage {
  private readonly amountField: Locator;
  private readonly categoryRadioButton: Locator;
  private readonly chooseCategoryButton: Locator;
  private readonly addNewBudgetLink: Locator;
  private readonly saveButton: Locator;
  private readonly overallBudgetCard: Locator;
  private readonly addButton: Locator;
  private readonly deleteButton: Locator;
  private readonly confirmDeleteButton: Locator;

  constructor(public readonly page: Page) {
    this.amountField = this.page.getByLabel("Amount");
    this.categoryRadioButton = this.page.getByLabel("Category Budget");
    this.chooseCategoryButton = this.page.locator("#expense-form-category-select");
    this.addNewBudgetLink = this.page.getByRole("link", { name: "Add budget" });
    this.overallBudgetCard = this.page.locator("#overall-budget-card");
    this.saveButton = this.page.getByRole("button", { name: "Save" });
    this.addButton = this.page.getByRole("button", { name: "Add" });
    this.deleteButton = this.page.getByRole("button", { name: "Delete budget" });
    this.confirmDeleteButton = this.page.getByRole("button", {
      name: "Delete",
      exact: true
    });
  }

  async goto() {
    await this.page.goto("/budgets");
  }

  async createBudget({ amount, category }: { amount: string; category?: string }) {
    await this.addNewBudgetLink.click();
    if (category) {
      await this.categoryRadioButton.click();
      await this.chooseCategoryButton.click();
      await this.page.getByRole("option", { name: category }).click();
    }
    await this.amountField.fill(amount);
    await this.addButton.click();
  }

  async editBudget({
    amount,
    type,
    category
  }: {
    amount: string;
    type: string;
    category?: string;
  }) {
    if (type === BudgetType.OVERALL) {
      await this.overallBudgetCard.click();
    }
    if (type === BudgetType.CATEGORY && category) {
      await this.page.locator("h3", { hasText: category }).click();
    }
    await this.amountField.fill(amount);
    await this.saveButton.click();
  }

  async deleteBudget({ type, category }: { type: string; category?: string }) {
    if (type === BudgetType.OVERALL) {
      await this.overallBudgetCard.click();
    }
    if (type === BudgetType.CATEGORY && category) {
      await this.page.locator(`#category-budget-card-${category}`).click();
    }
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
  }
}
