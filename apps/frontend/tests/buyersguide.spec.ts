import { test, expect } from "@playwright/test";

test("buyers guide redirect", async ({ page }) => {
  await page.route("https://example.com/*", (route) => route.fulfill({ status: 200, body: "ok" }));
  const res = await page.goto("/buyers-guide?utm_source=test");
  expect(res?.status()).toBe(200);
  expect(page.url()).toBe("https://example.com/buyers-guide");
});
