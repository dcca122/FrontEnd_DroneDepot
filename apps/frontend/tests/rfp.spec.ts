import { test, expect } from "@playwright/test";

test("rfp happy path", async ({ page }) => {
  await page.route("**/api/rfp", (route) => route.fulfill({ status: 200, body: "{}" }));
  await page.goto("/rfp");
  await page.fill("input[name=name]", "John Doe");
  await page.fill("input[name=organization]", "Org");
  await page.fill("input[name=email]", "john@example.com");
  await page.fill("input[name=phone]", "555-5555");
  await page.fill("input[name=city]", "LA");
  await page.selectOption("select[name=projectType]", "inspection");
  await page.fill("input[name=budgetRange]", "1000");
  await page.fill("input[name=dueDate]", "2030-01-01");
  await page.fill("textarea[name=description]", "Test project");
  await page.check("input[name=consent]");
  await page.click("button[type=submit]");
  await expect(page.locator("text=Thanks!")).toBeVisible();
});
