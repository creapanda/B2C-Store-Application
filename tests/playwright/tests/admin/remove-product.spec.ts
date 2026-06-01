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

test.describe("ADMIN PRODUCT REMOVAL", () => {
  test(
    "removes a product from the admin dashboard",
    { tag: "@a3" },
    async ({ page }) => {
      await signIn(page);

      const product = page
        .locator("article")
        .filter({ hasText: "Studio Chat Headset" });
      await expect(product).toBeVisible();

      page.once("dialog", async (dialog) => {
        expect(dialog.message()).toContain("Remove Studio Chat Headset?");
        await dialog.accept();
      });

      await product.getByRole("button", { name: "Remove" }).click();
      await expect(product).toHaveCount(0);

      await page.reload();
      await expect(
        page.locator("article").filter({ hasText: "Studio Chat Headset" }),
      ).toHaveCount(0);
    },
  );
});
