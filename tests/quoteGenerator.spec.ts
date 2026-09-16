import { test, expect } from "@playwright/test";

test.beforeEach("open page", async ({ page }) => {
  await page.goto("http://localhost:8080/#/quotes");
});

test("display quote", async ({ page }) => {
  await page.locator('[data-test="get-quote"]').click();
  await expect(page.locator("ul.quote-list").locator("li")).toBeVisible();
  await expect(page.locator("ul.quote-list").locator("li")).not.toBeEmpty();
});

test("title should be correct", async ({ page }) => {
  await expect(page.locator("h1.title")).toHaveText("Potter Quotes");
  await expect(
    page.getByRole("heading", { name: "Potter Quotes" }),
  ).toBeVisible();
});

test("remove quote is disabled on page open", async ({ page }) => {
  await expect(
    page.getByRole("button", { name: "Remove Quote" }),
  ).toBeDisabled();
});

test("empty list should have a message displayed", async ({ page }) => {
  await expect(
    page.getByText("Click the button to get some wisdom", { exact: true }),
  ).toBeVisible();
});

test("wisdom points are updated on button click", async ({ page }) => {
  await page.locator('[data-test="get-quote"]').click();
  await expect(page.locator('[data-test="wisdom-points"]')).toContainText("+1");
  await expect(page.locator('[data-test="wisdom-points"]')).toHaveText(
    "wisdom points +1",
  );
});
