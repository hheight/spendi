import { type Locator, type Page } from "@playwright/test";

export class ExpensesPage {
  private readonly descriptionField: Locator;
  private readonly amountField: Locator;
  private readonly newCategoryRadioButton: Locator;
  private readonly categoryNameField: Locator;
  private readonly addNewExpenseLink: Locator;
  private readonly saveExpenseButton: Locator;
  private readonly addExpenseButton: Locator;

  constructor(public readonly page: Page) {
    this.descriptionField = this.page.getByLabel("Description");
    this.amountField = this.page.getByLabel("Amount");
    this.newCategoryRadioButton = this.page.getByLabel("Create new category");
    this.categoryNameField = this.page.getByLabel("Name");
    this.addNewExpenseLink = this.page.getByRole("link", { name: "Add new expense" });
    this.saveExpenseButton = this.page.getByRole("button", { name: "Save" });
    this.addExpenseButton = this.page.getByRole("button", { name: "Add" });
  }

  async goto() {
    await this.page.goto("/expenses");
  }

  async createExpense(description: string, amount: string, categoryName: string) {
    await this.addNewExpenseLink.click();
    await this.descriptionField.fill(description);
    await this.amountField.fill(amount);
    await this.newCategoryRadioButton.click();
    await this.categoryNameField.fill(categoryName);
    await this.addExpenseButton.click();
  }

  async editExpense(description: string, amount: string, categoryName?: string) {
    await this.descriptionField.fill(description);
    await this.amountField.fill(amount);
    if (categoryName) {
      await this.newCategoryRadioButton.click();
      await this.categoryNameField.fill(categoryName);
    }
    await this.saveExpenseButton.click();
  }
}
