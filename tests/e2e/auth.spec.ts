import { test, expect } from '@playwright/test';

test('unauthorized users are redirected to login', async ({ page }) => {
  await page.goto('/dashboard');

  await page.waitForLoadState('domcontentloaded');

  await expect(page).toHaveURL(/\/login$/);
});
