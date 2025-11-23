import { type Page, type Locator } from "@playwright/test";

export class SignupPage {
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly confirmField: Locator;

  constructor(public readonly page: Page) {
    this.emailField = this.page.locator("#signup-form-email");
    this.passwordField = this.page.locator("#signup-form-password");
    this.confirmField = this.page.locator("#signup-form-confirm");
  }

  async goto() {
    await this.page.goto("/signup");
  }

  async submitForm(email: string, password: string) {
    await this.page.waitForLoadState("networkidle");
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.confirmField.fill(password);
    await this.confirmField.press("Enter");
  }
}
