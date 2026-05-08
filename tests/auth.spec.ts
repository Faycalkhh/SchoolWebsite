import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("professor can log in with seed credentials", async ({ page }) => {
    await page.goto("/login/professor");
    await page.locator('input[type="email"]').fill("prof@nur.com");
    await page.locator('input[type="password"]').fill("prof123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard/professor", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard\/professor/);
  });

  test("parent can log in with seed credentials", async ({ page }) => {
    await page.goto("/login/parent");
    await page.locator('input[type="email"]').fill("parent@nur.com");
    await page.locator('input[type="password"]').fill("parent123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard/parent", { timeout: 10_000 });
    await expect(page).toHaveURL(/\/dashboard\/parent/);
  });

  test("wrong password shows error", async ({ page }) => {
    await page.goto("/login/professor");
    await page.locator('input[type="email"]').fill("prof@nur.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.locator('button[type="submit"]').click();
    await expect(page.getByText(/incorrect|غير صحيحة/i).first()).toBeVisible({ timeout: 8_000 });
  });
});
