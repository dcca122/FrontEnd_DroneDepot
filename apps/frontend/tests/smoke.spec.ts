import { test, expect } from "@playwright/test";

// @smoke — quick checks for PRs
test("@smoke home renders and nav works", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("link", { name: "Services" })).toBeVisible();
  await expect(page.getByRole("link", { name: "RFP Desk" })).toBeVisible();
});

test("@smoke buyers-guide redirects", async ({ request, page }) => {
  const dr = process.env.NEXT_PUBLIC_DRONEREGION_URL || "https://droneregion.com";
  const q = "utm_source=smoke&utm_medium=ci";
  const res = await request.get(`/buyers-guide?${q}`, { maxRedirects: 0 });
  expect([307, 308]).toContain(res.status());
  expect(res.headers()["location"]).toBe(`${dr}/buyers-guide?${q}`);
  await page.goto(`/buyers-guide?${q}`);
  await expect(page).toHaveURL(`${dr}/buyers-guide?${q}`);
});
