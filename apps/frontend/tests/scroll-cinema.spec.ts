import { test, expect, type Locator } from "@playwright/test";

async function getOpacity(el: Locator) {
  return el.evaluate((e) => parseFloat(getComputedStyle(e).opacity));
}

async function sectionScroll(section: Locator, ratio: number) {
  await section.evaluate((el, r) => {
    const rect = el.getBoundingClientRect();
    window.scrollTo(0, window.scrollY + rect.top + rect.height * r);
  }, ratio);
  await section.page().waitForTimeout(50);
}

test("videos are full-bleed, sticky, and CTA fades", async ({ page }) => {
  await page.goto("/");
  const sections = page.locator("main section");
  expect(await sections.count()).toBe(3);

  for (let i = 0; i < 3; i++) {
    const section = sections.nth(i);
    const wrapper = section.locator('[data-testid="video-wrapper"]');
    const cta = section.locator('[data-testid="cta-panel"]');

    await sectionScroll(section, 0.05);
    const box = await wrapper.boundingBox();
    const vp = page.viewportSize();
    if (!box || !vp) throw new Error("bounding boxes not found");
    expect(Math.abs(box.width - vp.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(box.height - vp.height)).toBeLessThanOrEqual(1);

    const topStart = await wrapper.evaluate((e) => e.getBoundingClientRect().top);
    await sectionScroll(section, 0.6);
    const topMid = await wrapper.evaluate((e) => e.getBoundingClientRect().top);
    expect(Math.abs(topStart - topMid)).toBeLessThanOrEqual(8);

    await sectionScroll(section, 0.1);
    expect(await getOpacity(cta)).toBeLessThan(0.15);
    await sectionScroll(section, 0.3);
    expect(await getOpacity(cta)).toBeGreaterThan(0.75);
    await sectionScroll(section, 0.9);
    expect(await getOpacity(cta)).toBeLessThan(0.15);
  }
});

test("mobile layout stacks CTA below video and keeps it visible", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");

  const section = page.locator("main section").first();
  const videoBox = await section.locator('[data-testid="video-wrapper"]').boundingBox();
  const cta = section.locator('[data-testid="cta-panel"]');
  const ctaBox = await cta.boundingBox();
  if (!videoBox || !ctaBox) throw new Error("bounding boxes not found");

  expect(ctaBox.y).toBeGreaterThanOrEqual(videoBox.y + videoBox.height);
  expect(await getOpacity(cta)).toBeGreaterThan(0.9);
});
