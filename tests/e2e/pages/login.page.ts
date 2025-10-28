import type { Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/login');
    await this.page.waitForURL('/login');
  }

  async populateForm(email: string, password: string) {
    await this.page.fill('#login-form-email', email);
    await this.page.fill('#login-form-password', password);
  }
}
