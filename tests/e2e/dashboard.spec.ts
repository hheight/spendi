import { test, expect } from "./fixtures/auth.fixture";

test.describe("dashboard", () => {
  test("shows empty card when no expenses added", async ({ authenticatedPage: page }) => {
    await expect(page.getByText("Get started by adding expenses.")).toBeAttached();
  });
});
