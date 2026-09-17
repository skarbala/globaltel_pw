import { test, expect } from "@playwright/test";
test("create an offer with correct data", async ({ page }) => {
  const fund = "Death Eater Dominance Fund";

  await page.goto("/#/gringottsBank");
  // page.locator("[id=selectedFund]");

  await page.locator("#selectedFund").selectOption(fund);
  await page.locator("#oneTimeInvestment").fill("25000");
  await page.locator("#years").fill("20");
  //  await page.getByRole("button", { name: "Make me an offer" }).click();
  await page.locator('[data-test="create-offer"]').click();

  const offerDetail = page.locator("div.offer-detail");
  await expect(offerDetail.locator("div.your-data")).toBeVisible();
  await expect(offerDetail.locator("div.your-data p.fund span")).toHaveText(
    fund,
  );
  //samostatne overit pocet rokov
  await expect(
    offerDetail.locator("div.your-data").locator("p.period").locator("span"),
  ).toHaveText("20 years");
});
