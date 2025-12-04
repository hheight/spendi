import { type Locator, type Page } from "@playwright/test";

export class ExpensesPage {
  private readonly descriptionField: Locator;
  private readonly amountField: Locator;
  private readonly newCategoryRadioButton: Locator;
  private readonly categoryNameField: Locator;
  private readonly addNewExpenseLink: Locator;
  private readonly saveExpenseButton: Locator;
  private readonly addExpenseButton: Locator;
  private readonly deleteExpenseButton: Locator;
  private readonly confirmDeleteExpenseButton: Locator;
  private readonly datePickerButton: Locator;
  private readonly yearSelect: Locator;
  private readonly monthSelect: Locator;
  private readonly timeInput: Locator;

  constructor(public readonly page: Page) {
    this.descriptionField = this.page.getByLabel("Description");
    this.amountField = this.page.getByLabel("Amount");
    this.newCategoryRadioButton = this.page.getByLabel("Create new category");
    this.categoryNameField = this.page.getByLabel("Name");
    this.addNewExpenseLink = this.page.getByRole("link", { name: "Add expense" });
    this.saveExpenseButton = this.page.getByRole("button", { name: "Save" });
    this.addExpenseButton = this.page.getByRole("button", { name: "Add" });
    this.deleteExpenseButton = this.page.getByRole("button", { name: "Delete expense" });
    this.confirmDeleteExpenseButton = this.page.getByRole("button", {
      name: "Delete",
      exact: true
    });
    this.datePickerButton = this.page.locator("#date-picker");
    this.yearSelect = this.page.locator("select.rdp-years_dropdown");
    this.monthSelect = this.page.locator("select.rdp-months_dropdown");
    this.timeInput = this.page.locator("#time-picker");
  }

  async goto() {
    await this.page.goto("/expenses");
  }

  async createExpense({
    description,
    amount,
    categoryName,
    date
  }: {
    description: string;
    amount: string;
    categoryName: string;
    date?: { year: string; month: string; day: string; time?: string };
  }) {
    await this.addNewExpenseLink.click();
    await this.descriptionField.fill(description);
    await this.amountField.fill(amount);
    if (date) {
      await this.datePickerButton.click();
      await this.yearSelect.selectOption(date.year);
      await this.monthSelect.selectOption(date.month);
      await this.page
        .locator(".rdp-day:not(.rdp-outside) button")
        .getByText(date.day, { exact: true })
        .click();

      if (date.time) {
        await this.timeInput.fill(date.time);
      }
    }
    await this.newCategoryRadioButton.click();
    await this.categoryNameField.fill(categoryName);
    await this.addExpenseButton.click();
  }

  async editExpense({
    description,
    amount,
    categoryName,
    date
  }: {
    description: string;
    amount: string;
    categoryName?: string;
    date?: { year: string; month: string; day: string; time?: string };
  }) {
    await this.descriptionField.fill(description);
    await this.amountField.fill(amount);
    if (date) {
      await this.datePickerButton.click();
      await this.yearSelect.selectOption(date.year);
      await this.monthSelect.selectOption(date.month);
      await this.page
        .locator(".rdp-day:not(.rdp-outside) button")
        .getByText(date.day, { exact: true })
        .click();

      if (date.time) {
        await this.timeInput.fill(date.time);
      }
    }
    if (categoryName) {
      await this.newCategoryRadioButton.click();
      await this.categoryNameField.fill(categoryName);
    }
    await this.saveExpenseButton.click();
  }

  async deleteExpense(name: string) {
    await this.page.getByRole("link", { name }).click();
    await this.deleteExpenseButton.click();
    await this.confirmDeleteExpenseButton.click();
  }
}
