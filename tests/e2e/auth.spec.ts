import { test, expect } from "./fixtures/auth.fixture";

test.describe("auth", () => {
  test("should redirect unauthorized user to the login page", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("should warn if login form is empty", async ({ page, loginPage }) => {
    await loginPage.page.click("button[type=submit]");

    await expect(page.getByText("Please enter a valid email")).toBeVisible();
    await expect(page.getByText("Password is required")).toBeVisible();
  });

  test("should warn if login is invalid", async ({ page, loginPage }) => {
    await loginPage.submitForm("invalid@test.com", "password123");

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should redirect to the dashboard page when a new account is created", async ({
    page,
    signupPage,
    user_credentials
  }) => {
    await signupPage.submitForm(user_credentials.email, user_credentials.password);

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should redirect to the dashboard page when logged in", async ({
    account,
    loginPage,
    page
  }) => {
    await loginPage.submitForm(account.email, account.password);

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should redirect to the login page after logging out", async ({
    account,
    loginPage,
    page
  }) => {
    await loginPage.submitForm(account.email, account.password);

    await page.click("header span[data-slot=dropdown-menu-trigger]");
    await page.getByText("Log Out").click();

    await expect(page).toHaveURL(/\/login$/);
  });
});
