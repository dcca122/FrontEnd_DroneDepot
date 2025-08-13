import { test, expect } from "@playwright/test";

test("404 page", async ({ page }) => {
  const res = await page.goto("/non-existent");
  expect(res?.status()).toBe(404);
  await expect(page.locator("text=404 - Not Found")).toBeVisible();
});
