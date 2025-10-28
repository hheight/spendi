import type { Page } from '@playwright/test';

export class SignupPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/signup');
    await this.page.waitForURL('/signup');
  }

  async populateForm(email: string, password: string) {
    await this.page.fill('#signup-form-email', email);
    await this.page.fill('#signup-form-password', password);
    await this.page.fill('#signup-form-confirm', password);
  }
}
