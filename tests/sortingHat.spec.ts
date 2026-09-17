import { test, expect } from "@playwright/test";

test("display message on sort click", async ({ page }) => {
  await page.goto("http://localhost:8080/#/sortingHat");
  await page.getByRole("button", { name: "Sort me" }).click();

  //1. pockam na odpoved z backendu
  await page.waitForResponse("http://localhost:3000/sortingHat");
  //2. overim status odpovede
  //3. vytiahnem data z odpovede
  await expect(page.locator('[data-test="result-message"]')).toBeVisible();
  await expect(page.locator('[data-test="house-result"]')).toBeVisible();
});
