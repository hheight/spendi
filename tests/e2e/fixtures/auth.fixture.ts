import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";
import { SignupPage } from "../pages/signup.page";
import prisma from "../../helpers/prisma";
import { faker } from "@faker-js/faker";

type UserDetails = {
  email: string;
  password: string;
};

type AuthFixtures = {
  loginPage: LoginPage;
  signupPage: SignupPage;
  user_credentials: UserDetails;
  account: UserDetails;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();
    await use(signupPage);
  },
  user_credentials: async ({}, use) => {
    const email = faker.internet.email();
    const password = faker.internet.password({ prefix: "1" });

    await use({
      email,
      password
    });

    await prisma.user.deleteMany({ where: { email } });
  },
  account: async ({ browser, user_credentials }, use) => {
    const page = await browser.newPage();
    const signupPage = new SignupPage(page);

    await signupPage.goto();
    await signupPage.populateForm(user_credentials.email, user_credentials.password);
    await page.click("button[type=submit]");
    await page.waitForURL("/dashboard");
    await page.close();
    await use(user_credentials);
  }
});

export { expect } from "@playwright/test";
