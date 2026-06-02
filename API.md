# API Reference

## Customer Store API (`apps/web`)

Base path: `/api/store`

### GET `/api/store/products`
- Query params:
  - `q` — optional search term
  - `category` — optional category filter
- Returns: a list of active products matching the query and category.

### POST `/api/store/auth/register`
- Body JSON:
  - `name` (string)
  - `email` (string)
  - `password` (string, minimum 6 characters)
- Behavior:
  - Creates a store user account.
  - Sets the store auth cookie.
  - Returns `201` with the created user.
- Errors:
  - `400` when fields are missing or invalid.
  - `409` when the email is already registered.

### POST `/api/store/auth/login`
- Body JSON:
  - `email` (string)
  - `password` (string)
- Behavior:
  - Authenticates the user.
  - Sets the store auth cookie.
  - Returns the user object.
- Errors:
  - `400` when fields are missing.
  - `401` for invalid credentials.

### GET `/api/store/auth/me`
- Returns the authenticated store user.
- Errors:
  - `401` when the user is not authenticated.

### POST `/api/store/auth/logout`
- Clears the store auth cookie.
- Returns `{ ok: true }`.

### POST `/api/store/checkout`
- Requires authentication.
- Body JSON:
  - `items`: array of `{ productId, quantity }`
- Behavior:
  - Creates a purchase for the authenticated user.
  - Returns `201` with the purchase data.
- Errors:
  - `401` when unauthorized.
  - `400` for invalid cart items or checkout failure.

### GET `/api/store/purchases`
- Requires authentication.
- Returns purchase history for the logged-in customer.
- Errors:
  - `401` when unauthorized.

## Admin API (`apps/admin`)

Base path: `/api`

### POST `/api/auth`
- Accepts either JSON or form data.
- Body:
  - `password`
- Behavior:
  - Validates against `env.PASSWORD`.
  - Sets the `auth_token` cookie when successful.
  - Redirects to `/` on success.
- Errors:
  - Invalid password also redirects to `/`.

### DELETE `/api/auth`
- Clears the admin `auth_token` cookie.
- Returns `{ message: "Logged out" }`.

### GET `/api/products`
- Requires admin login.
- Returns all products.
- Errors:
  - `401` when unauthorized.

### POST `/api/products`
- Requires admin login.
- Body JSON:
  - `sku` (string)
  - `name` (string)
  - `description` (string)
  - `price` (number, >= 0)
  - `category` (string, one of `Keyboard`, `Mouse`, `Headset`)
  - `imageUrl` (string)
  - `stock` (integer, >= 0)
  - `active` (optional boolean)
- Behavior:
  - Creates a new product.
  - Returns `201` with the product.
- Errors:
  - `401` when unauthorized.
  - `400` for missing or invalid fields.

### GET `/api/products/[sku]`
- Requires admin login.
- Returns a product by SKU.
- Errors:
  - `401` when unauthorized.
  - `400` when SKU is invalid.
  - `404` when the product is not found.

### PUT `/api/products/[sku]`
- Requires admin login.
- Body JSON: same product fields as POST.
- Behavior:
  - Updates an existing product.
  - Returns the updated product.
- Errors:
  - `401` when unauthorized.
  - `400` for invalid SKU or request body.
  - `400` when update fails.

### DELETE `/api/products/[sku]`
- Requires admin login.
- Deletes the product identified by SKU.
- Returns `{ ok: true }`.
- Errors:
  - `401` when unauthorized.
  - `400` for invalid SKU or delete failure.

### GET `/api/purchases`
- Requires admin login.
- Returns all purchase records for admin review.
- Errors:
  - `401` when unauthorized.

## Additional endpoint

### GET `/api/seed` (`apps/web`)
- Available only when `process.env.E2E` is enabled.
- Runs the seed process and returns `{ message: "Seeded" }`.
- Returns `501` when not available.
