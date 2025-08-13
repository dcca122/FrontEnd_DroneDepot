import { test, expect } from "@playwright/test";

test("header nav links", async ({ page }) => {
  await page.goto("/");
  const labels = [
    "Home",
    "How It Works",
    "Services",
    "RFP Desk",
    "Concierge",
    "Case Studies",
    "Pricing",
    "FAQ",
    "Contact",
    "Buyer’s Guide",
  ];
  for (const text of labels) {
    await expect(page.locator("header")).toContainText(text);
  }
});
