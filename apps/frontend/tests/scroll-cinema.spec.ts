import { test, expect } from "@playwright/test";

test("mobile layout stacks video and CTA", async ({ page }) => {
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
