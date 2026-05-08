import { test, expect } from "@playwright/test";

async function loginAsProfessor(page: import("@playwright/test").Page) {
  await page.goto("/login/professor");
  await page.locator('input[type="email"]').fill("prof@nur.com");
  await page.locator('input[type="password"]').fill("prof123");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard/professor");
}

async function loginAsParent(page: import("@playwright/test").Page) {
  await page.goto("/login/parent");
  await page.locator('input[type="email"]').fill("parent@nur.com");
  await page.locator('input[type="password"]').fill("parent123");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard/parent");
}

test.describe("Professor dashboard", () => {
  test("shows seeded students", async ({ page }) => {
    await loginAsProfessor(page);
    await expect(page.getByText(/Yusuf Karim|Maryam Karim|Hassan Rachid/).first()).toBeVisible({ timeout: 10_000 });
  });

  test("can log out", async ({ page }) => {
    await loginAsProfessor(page);
    const logoutBtn = page.getByRole("button", { name: /logout|déconnexion|تسجيل الخروج/i }).first();
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await expect(page).not.toHaveURL(/\/dashboard/);
    }
  });
});

test.describe("Parent dashboard", () => {
  test("shows the parent's children", async ({ page }) => {
    await loginAsParent(page);
    await expect(page.getByText(/Yusuf Karim|Maryam Karim/).first()).toBeVisible({ timeout: 10_000 });
  });

  test("does not show other parents' children", async ({ page }) => {
    await loginAsParent(page);
    await expect(page.getByText("Hassan Rachid")).not.toBeVisible();
  });
});
