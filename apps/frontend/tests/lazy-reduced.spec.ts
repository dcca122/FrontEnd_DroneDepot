import { test, expect, type Locator } from "@playwright/test";

async function getOpacity(el: Locator) {
  return el.evaluate((e) => parseFloat(getComputedStyle(e).opacity));
}

test("lazy-loads video sources only after intersection", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("main section");
  const second = sections.nth(1).locator('[data-testid="video-wrapper"]');

  await expect(second.locator("source")).toHaveCount(0);

  const [req] = await Promise.all([
    page.waitForRequest(/hero\.mp4$/),
    second.scrollIntoViewIfNeeded(),
  ]);

  await expect(second.locator("source")).toHaveCount(1);
  expect(req.url()).toMatch(/hero\.mp4$/);
});

test("respects prefers-reduced-motion (no autoplay, CTA visible)", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const video = page.locator('[data-testid="video-wrapper"] video').first();
  await page.waitForTimeout(500);
  const time = await video.evaluate((v) => (v as HTMLVideoElement).currentTime);
  expect(time).toBeLessThan(0.2);

  const cta = page.locator('[data-testid="cta-panel"]').first();
  expect(await getOpacity(cta)).toBeGreaterThan(0.9);
});
