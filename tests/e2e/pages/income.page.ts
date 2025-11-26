import { expect, type Locator, type Page } from "@playwright/test";

export class IncomePage {
  private readonly incomeField: Locator;
  private readonly saveIncomeButton: Locator;

  constructor(public readonly page: Page) {
    this.incomeField = this.page.locator("#income-form-input");
    this.saveIncomeButton = this.page.getByRole("button", { name: "Save" });
  }

  async goto() {
    await this.page.goto("/income");
  }

  async editIncome(amount: string) {
    await this.incomeField.fill(amount);
    await this.saveIncomeButton.click();
    await expect(this.saveIncomeButton).toBeEnabled();
  }
}
