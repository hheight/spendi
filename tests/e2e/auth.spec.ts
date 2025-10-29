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
    await loginPage.populateForm("invalid@test.com", "password123");
    await page.click("button[type=submit]");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("should redirect to the dashboard page when a new account is created", async ({
    user_credentials,
    signupPage,
    page
  }) => {
    await signupPage.populateForm(user_credentials.email, user_credentials.password);
    await page.click("button[type=submit]");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("should redirect to the dashboard page when logged in", async ({
    account,
    loginPage,
    page
  }) => {
    await loginPage.populateForm(account.email, account.password);
    await page.click("button[type=submit]");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
