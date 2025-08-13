import { test, expect } from "@playwright/test";

test("CTA panel remains sticky while scrolling", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator("[data-testid='cta-panel']").first();
  await cta.waitFor();
  const startBox = await cta.boundingBox();
  await page.evaluate(() => window.scrollBy(0, 800));
  const endBox = await cta.boundingBox();
  if (startBox && endBox) {
    expect(Math.abs(startBox.y - endBox.y)).toBeLessThanOrEqual(5);
  } else {
    throw new Error("bounding boxes not found");
  }
});

test("CTA panel fades after scroll", async ({ page }) => {
  await page.goto("/");
  const cta = page.locator("[data-testid='cta-panel']").first();
  const initialOpacity = await cta.evaluate((el) =>
    parseFloat(getComputedStyle(el).opacity)
  );
  await page.evaluate(() => window.scrollBy(0, 1000));
  const scrolledOpacity = await cta.evaluate((el) =>
    parseFloat(getComputedStyle(el).opacity)
  );
  expect(scrolledOpacity).toBeLessThan(initialOpacity);
  expect(scrolledOpacity).toBeLessThanOrEqual(0.1);
});
