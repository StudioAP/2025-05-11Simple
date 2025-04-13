import { test, expect } from '@playwright/test';

test('ホームページのタイトルが正しいこと', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await expect(page).toHaveTitle(/京都ローンテニスクラブ/);
});

test('ヒーローセクションが表示されていること', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const heroSection = page.locator('section').first();
  await expect(heroSection).toBeVisible();
});

test('ナビゲーションメニューが表示されていること', async ({ page }) => {
  await page.goto('http://localhost:3000');
  const nav = page.locator('nav');
  await expect(nav).toBeVisible();
}); 