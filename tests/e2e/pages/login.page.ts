import { type Locator, type Page } from "@playwright/test";

export class LoginPage {
  private readonly emailField: Locator;
  private readonly passwordField: Locator;

  constructor(public readonly page: Page) {
    this.emailField = this.page.locator("#login-form-email");
    this.passwordField = this.page.locator("#login-form-password");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async submitForm(email: string, password: string) {
    await this.page.waitForLoadState("networkidle");
    await this.emailField.fill(email);
    await this.passwordField.fill(password);
    await this.passwordField.press("Enter");
  }
}
