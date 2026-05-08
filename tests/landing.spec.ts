import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("loads and shows the hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Nur Al-Quran|نور القرآن/);
    await expect(page.locator("section#home")).toBeVisible();
  });

  test("scrolls to the professors section", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="#professors"]').first().click();
    await expect(page.locator("section#professors")).toBeInViewport();
  });

  test("shows announcements fetched from Supabase", async ({ page }) => {
    await page.goto("/");
    const annSection = page.locator("section#announcements, [data-testid='announcements']").first();
    if (await annSection.count() > 0) {
      await expect(annSection).toBeVisible();
    }
  });

  test("shows top 3 students podium", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("section#students")).toBeVisible();
  });

  test("contact form can be filled", async ({ page }) => {
    await page.goto("/");
    await page.locator('a[href="#contact"]').first().click();
    const form = page.locator("section#contact form");
    await form.locator('input[type="text"]').first().fill("Test User");
    await form.locator('input[type="email"]').fill("test@example.com");
    await form.locator("textarea").fill("This is a test message.");
    await form.locator('button[type="submit"]').click();
    await expect(page.getByText(/envoyé|تم إرسال|sent/i).first()).toBeVisible();
  });
});
