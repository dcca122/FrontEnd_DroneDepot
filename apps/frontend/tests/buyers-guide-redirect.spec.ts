import { test, expect } from "@playwright/test";

const dr = process.env.NEXT_PUBLIC_DRONEREGION_URL || "https://droneregion.com";

test("buyers guide redirect", async ({ page }) => {
  await page.route(`${dr}/*`, (route) => route.fulfill({ status: 200, body: "ok" }));
  const res = await page.goto("/buyers-guide?utm_source=test");
  expect(res?.status()).toBe(200);
  expect(page.url()).toBe(`${dr}/buyers-guide`);
});
