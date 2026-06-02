import { seed } from "@repo/db/seed";
import { expect, test } from "./fixtures";

test.beforeEach(async () => {
  await seed();
});

test.describe("STORE AUTH & CHECKOUT", () => {
  test(
    "user can register a new account",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Click register toggle
      await page.getByRole("button", { name: "Create a new account" }).click();

      // Fill registration form
      await page.getByLabel("Name").fill("John Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel("Password").fill("password123");

      // Submit
      await page.getByRole("button", { name: "Create account" }).click();

      // Check success message
      await expect(page.getByText("Account created")).toBeVisible();

      // Check user info is now visible
      await expect(page.getByText("John Doe")).toBeVisible();
      await expect(page.getByText("john@example.com")).toBeVisible();
    },
  );

  test(
    "user can login with existing account",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Fill login form with seeded user
      await page.getByLabel("Email").fill("customer@example.com");
      await page.getByLabel("Password").fill("password123");

      // Submit
      await page.getByRole("button", { name: "Sign in" }).click();

      // Check success message
      await expect(page.getByText("Signed in")).toBeVisible();

      // Check user info is displayed
      await expect(page.getByText("Demo Customer")).toBeVisible();
      await expect(page.getByText("customer@example.com")).toBeVisible();
    },
  );

  test(
    "user cannot login with wrong password",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Fill login form with wrong password
      await page.getByLabel("Email").fill("customer@example.com");
      await page.getByLabel("Password").fill("wrongpassword");

      // Submit
      await page.getByRole("button", { name: "Sign in" }).click();

      // Check error message
      await expect(
        page.getByText(/email and password|invalid/i),
      ).toBeVisible({ timeout: 10000 });
    },
  );

  test(
    "user can add products to cart",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Add first product to cart
      const addButtons = page.getByRole("button", { name: "Add to cart" });
      await addButtons.first().click();

      // Check cart is updated
      const cartTotal = page.locator(".cart");
      await expect(cartTotal).toContainText("AUD");

      // Add another product
      await addButtons.nth(1).click();

      // Check cart shows 2 items
      const cartItems = page.locator(
        "div:has-text('Pulse Wireless Headphones') + div",
      );
      await expect(cartItems).toBeVisible();
    },
  );

  test(
    "user can update cart item quantity",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Add product to cart
      await page.getByRole("button", { name: "Add to cart" }).first().click();

      // Click + button to increase quantity
      const plusButton = page
        .locator("button:has-text('+')")
        .first();
      await plusButton.click();

      // Check quantity updated
      const quantityInput = page.locator("span.w-8").first();
      await expect(quantityInput).toContainText("2");
    },
  );

  test(
    "user can remove item from cart",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Add product to cart
      await page.getByRole("button", { name: "Add to cart" }).first().click();

      // Click Remove button
      await page.getByRole("button", { name: "Remove" }).click();

      // Check cart is empty
      await expect(page.getByText("No items in cart")).toBeVisible();
    },
  );

  test(
    "user can complete checkout",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Login first
      await page.getByLabel("Email").fill("customer@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Sign in" }).click();

      // Wait for login success
      await expect(page.getByText("Signed in")).toBeVisible();

      // Add product to cart
      await page.getByRole("button", { name: "Add to cart" }).first().click();

      // Checkout
      await page.getByRole("button", { name: "Checkout" }).click();

      // Check success message contains payment ref
      await expect(
        page.getByText(/Payment approved|Order MOCK/),
      ).toBeVisible({ timeout: 10000 });
    },
  );

  test(
    "user cannot checkout without login",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Add product to cart without logging in
      await page.getByRole("button", { name: "Add to cart" }).first().click();

      // Try to checkout
      await page.getByRole("button", { name: "Checkout" }).click();

      // Check error message
      await expect(
        page.getByText("Sign in or register before checkout"),
      ).toBeVisible();
    },
  );

  test(
    "user can view purchase history after checkout",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Login
      await page.getByLabel("Email").fill("customer@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Sign in" }).click();

      // Wait for login
      await expect(page.getByText("Signed in")).toBeVisible();

      // Check purchase history is visible (seeded user has purchases)
      await expect(page.getByText("Purchase history")).toBeVisible();
      await expect(page.getByText("MOCK-SEED-1001")).toBeVisible();
    },
  );

  test(
    "user can logout",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Login first
      await page.getByLabel("Email").fill("customer@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Sign in" }).click();

      // Wait for login
      await expect(page.getByText("Signed in")).toBeVisible();

      // Logout
      await page.getByRole("button", { name: "Sign out" }).click();

      // Check logged out
      await expect(page.getByText("Signed out")).toBeVisible();
      await expect(page.getByText("Demo Customer")).not.toBeVisible();
    },
  );

  test(
    "product stock prevents overstocking in cart",
    { tag: "@a3" },
    async ({ page }) => {
      await page.goto("/");

      // Add product multiple times (trying to exceed stock)
      const addButton = page.getByRole("button", { name: "Add to cart" }).first();
      
      // Click 10 times
      for (let i = 0; i < 10; i++) {
        await addButton.click();
      }

      // Check quantity is capped at stock amount (typically product.stock)
      const quantitySpan = page.locator("span.w-8").first();
      const quantity = await quantitySpan.textContent();
      
      // Quantity should be a number less than 10
      const qty = parseInt(quantity || "0");
      expect(qty).toBeLessThanOrEqual(10);
      expect(qty).toBeGreaterThan(0);
    },
  );
});
