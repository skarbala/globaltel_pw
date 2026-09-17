import { test, expect } from "@playwright/test";

test("display message on sort click", async ({ page }) => {
  await page.goto("http://localhost:8080/#/sortingHat");
  await page.getByRole("button", { name: "Sort me" }).click();

  //1. pockam na odpoved z backendu
  const response = await page.waitForResponse("**/sortingHat");
  expect(
    response.status(),
    `Chyba backendu, nevratil 201 ale vratil ${response.status()}`,
  ).toBe(201);

  const body = await response.json();
  expect(body.sortingHatSays).toBeTruthy();
  expect(body.house).toBeTruthy();

  //4. overim ze data sa spravne zobrazia na stranke
  await expect(page.locator('[data-test="result-message"]')).toBeVisible();
  await expect(page.locator('[data-test="result-message"]')).toHaveText(
    body.sortingHatSays,
  );

  await expect(page.locator('[data-test="house-result"]')).toBeVisible();
  await expect(page.locator('[data-test="house-result"]')).toHaveText(
    body.house,
  );
});
