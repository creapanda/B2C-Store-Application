import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

test.describe("STORE CATALOG", () => {
  test(
    "user can browse products by category",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      await page.getByRole("link", { name: /Mouse/ }).click();

      await expect(page).toHaveURL("/category/mouse");
      await expect(
        page.getByRole("heading", { name: "Mouse Products" }),
      ).toBeVisible();
      await expect(page.locator("article")).toHaveCount(2);
      await expect(page.getByText("Ergo Wireless Mouse")).toBeVisible();
      await expect(page.getByText("Precision Gaming Mouse")).toBeVisible();
    },
  );

  test(
    "user can search products by name",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      await page.getByLabel("Search products").fill("Studio");

      await expect(page).toHaveURL(/\/search\?q=Studio/);
      await expect(page.locator("article")).toHaveCount(1);
      await expect(page.getByText("Studio Chat Headset")).toBeVisible();
    },
  );

  test(
    "user can sort products from cheap to expensive and expensive to cheap",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      await page.getByLabel("Sort by price").selectOption("price-asc");
      await expect(page.locator("article").first()).toContainText(
        "Low Profile Keyboard",
      );

      await page.getByLabel("Sort by price").selectOption("price-desc");
      await expect(page.locator("article").first()).toContainText(
        "Pulse Wireless Headset",
      );
    },
  );
});
