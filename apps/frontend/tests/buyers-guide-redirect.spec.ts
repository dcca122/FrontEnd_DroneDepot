import { test, expect } from "@playwright/test";

const dr = process.env.NEXT_PUBLIC_DRONEREGION_URL!;

test("redirects to DroneRegion with UTMs preserved", async ({ request }) => {
  const res = await request.get("/buyers-guide?utm_source=test&utm_medium=ad", {
    maxRedirects: 0,
  });
  expect([307, 308]).toContain(res.status());
  expect(res.headers()["location"]).toBe(
    `${dr}/buyers-guide?utm_source=test&utm_medium=ad`
  );
});

test("nav link appends current UTMs", async ({ page }) => {
  await page.goto("/?utm_source=test&utm_medium=ad");
  const link = page.getByRole("link", { name: "Buyer’s Guide" });
  await expect(link).toHaveAttribute(
    "href",
    `${dr}/buyers-guide?utm_source=test&utm_medium=ad`
  );
});
