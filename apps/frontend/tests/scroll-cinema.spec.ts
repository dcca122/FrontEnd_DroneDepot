import { test, expect } from "@playwright/test";

test("@deep lazy-loads videos on intersection", async ({ page }) => {
  await page.goto("/");
  const wrappers = page.locator("[data-testid='video-wrapper']");
  await expect(wrappers.nth(1).locator("source")).toHaveCount(0);
  await wrappers.nth(1).scrollIntoViewIfNeeded();
  await expect(wrappers.nth(1).locator("source")).toHaveCount(1);
});

test("@deep shows poster and no autoplay when reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const first = page.locator("[data-testid='video-wrapper']").first();
  await expect(first.getByRole("button", { name: "Tap to play" })).toBeVisible();
});

test("@deep mobile layout stacks video and CTA", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const section = page.locator("section").first();
  const videoBox = await section.locator("[data-testid='video-wrapper']").boundingBox();
  const ctaBox = await section.locator("[data-testid='cta-panel']").boundingBox();
  if (videoBox && ctaBox) {
    expect(ctaBox.y).toBeGreaterThanOrEqual(videoBox.y + videoBox.height);
  } else {
    throw new Error("bounding boxes not found");
  }
});
