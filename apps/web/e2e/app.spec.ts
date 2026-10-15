import { test, expect } from '@playwright/test';

test.describe('Web App Core E2E Flow', () => {
  test('loads login page initially', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Dwirro')).toBeVisible();
  });
});
