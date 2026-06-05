import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

const adminPassword = process.env.PASSWORD ?? "admin123";

test.beforeEach(async () => {
  await seed();
});

async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.getByLabel("Password", { exact: true }).fill(adminPassword);
  await page.getByRole("button", { name: "Sign In" }).click();
  await expect(page.getByRole("heading", { name: "PNHStore Admin" })).toBeVisible();
}

test.describe("ADMIN PRODUCT MANAGEMENT", () => {
  test(
    "admin can create a product",
    { tag: "@a3" },
    async ({ page }) => {
      await signIn(page);

      await page.getByRole("link", { name: "Create Product" }).click();
      await expect(
        page.getByRole("heading", { name: "Create Product" }),
      ).toBeVisible();

      await page.getByLabel("SKU").fill("E2E-KEYBOARD-01");
      await page.getByLabel("Name").fill("E2E Test Keyboard");
      await page.getByLabel("Category").selectOption("Keyboard");
      await page
        .getByLabel("Description")
        .fill("A keyboard product created by the E2E suite.");
      await page.getByLabel("Price").fill("123");
      await page.getByLabel("Stock").fill("7");
      await page
        .getByLabel("Image URL")
        .fill("https://images.unsplash.com/photo-1587829741301-dc798b83add3");
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.getByText("Product saved successfully")).toBeVisible();

      await page.getByRole("link", { name: "Back" }).click();
      await expect(page.getByText("E2E Test Keyboard")).toBeVisible();
      await expect(page.getByText("E2E-KEYBOARD-01")).toBeVisible();
    },
  );

  test(
    "admin can toggle a product between active and inactive",
    { tag: "@a3" },
    async ({ page }) => {
      await signIn(page);

      const product = page
        .locator("article")
        .filter({ hasText: "Studio Chat Headset" });
      await expect(product).toBeVisible();

      await product.getByRole("button", { name: "Active" }).click();
      await expect(product.getByRole("button", { name: "Inactive" })).toBeVisible();

      await page.reload();
      await expect(
        page
          .locator("article")
          .filter({ hasText: "Studio Chat Headset" })
          .getByRole("button", { name: "Inactive" }),
      ).toBeVisible();
    },
  );

  test(
    "admin can logout",
    { tag: "@a3" },
    async ({ page }) => {
      await signIn(page);

      await page.getByRole("button", { name: "Logout" }).click();

      await expect(page.getByRole("heading", { name: "Admin Login" })).toBeVisible();
      await expect(page.getByLabel("Password", { exact: true })).toBeVisible();
    },
  );
});
