import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

test.describe("STORE NAVIGATION", () => {
  test(
    "does not show an admin link on the customer storefront",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      await expect(page.getByRole("link", { name: "Admin" })).toHaveCount(0);
      await expect(page.getByRole("link", { name: "PNHStore" })).toBeVisible();
    },
  );
});
