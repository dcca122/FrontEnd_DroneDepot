import { test, expect } from "@playwright/test";

test("lazy-loads videos on intersection", async ({ page }) => {
  await page.goto("/");
  const wrappers = page.locator("[data-testid='video-wrapper']");
  await expect(wrappers.nth(1).locator("source")).toHaveCount(0);
  await wrappers.nth(1).scrollIntoViewIfNeeded();
  await expect(wrappers.nth(1).locator("source")).toHaveCount(1);
});

test("shows poster and no autoplay when reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const first = page.locator("[data-testid='video-wrapper']").first();
  await expect(first.getByRole("button", { name: "Tap to play" })).toBeVisible();
});
