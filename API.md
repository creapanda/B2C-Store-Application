# API Documentation

This project exposes two Next.js API surfaces:

- Web store API: `http://localhost:3001/api`
- Admin API: `http://localhost:3002/api`

All request and response bodies are JSON unless noted otherwise.

## Authentication

### Store customer auth

Customer endpoints use an HTTP-only cookie named `store_auth_token`.

The cookie is created by:

- `POST /api/store/auth/register`
- `POST /api/store/auth/login`

The cookie is required by:

- `GET /api/store/auth/me`
- `POST /api/store/checkout`
- `GET /api/store/purchases`

### Admin auth

Admin endpoints use an HTTP-only cookie named `auth_token`.

The cookie is created by:

- `POST /api/auth`

The cookie is required by:

- `GET /api/products`
- `POST /api/products`
- `GET /api/products/{sku}`
- `PUT /api/products/{sku}`
- `DELETE /api/products/{sku}`
- `GET /api/purchases`

## Data Shapes

### Product

```json
{
  "id": 1,
  "sku": "AUDIO-PULSE-01",
  "name": "Pulse Wireless Headphones",
  "description": "Noise-isolating over-ear headphones with 40 hours of battery.",
  "price": 129,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 18,
  "active": true,
  "createdAt": "2026-01-08T00:00:00.000Z",
  "updatedAt": "2026-01-08T00:00:00.000Z"
}
```

### Store User

```json
{
  "id": 1,
  "name": "Demo Customer",
  "email": "customer@example.com",
  "role": "user",
  "createdAt": "2026-01-08T00:00:00.000Z"
}
```

### Purchase

```json
{
  "id": 1,
  "userId": 1,
  "userName": "Demo Customer",
  "userEmail": "customer@example.com",
  "totalAmount": 187,
  "paymentStatus": "paid",
  "paymentRef": "MOCK-1710000000000",
  "createdAt": "2026-01-08T00:00:00.000Z",
  "items": [
    {
      "id": 1,
      "productId": 1,
      "quantity": 1,
      "unitPrice": 129,
      "productName": "Pulse Wireless Headphones"
    }
  ]
}
```

## Web Store API

### List active products

`GET /api/store/products`

Returns active products for the public storefront.

Query parameters:

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `q` | string | No | Searches product name and description. |
| `category` | string | No | Filters by exact category name. |

Example:

```bash
curl "http://localhost:3001/api/store/products?q=headphones"
```

Success response: `200 OK`

```json
[
  {
    "id": 1,
    "sku": "AUDIO-PULSE-01",
    "name": "Pulse Wireless Headphones",
    "description": "Noise-isolating over-ear headphones with 40 hours of battery.",
    "price": 129,
    "imageUrl": "https://example.com/image.jpg",
    "category": "Electronics",
    "stock": 18,
    "active": true,
    "createdAt": "2026-01-08T00:00:00.000Z",
    "updatedAt": "2026-01-08T00:00:00.000Z"
  }
]
```

### Register customer

`POST /api/store/auth/register`

Creates a customer account and sets the `store_auth_token` cookie.

Request body:

```json
{
  "name": "Demo Customer",
  "email": "customer@example.com",
  "password": "password123"
}
```

Validation:

- `name` is required.
- `email` is required.
- `password` must be at least 6 characters.
- Email must not already exist.

Success response: `201 Created`

Error responses:

- `400 Bad Request` when required fields are missing or invalid.
- `409 Conflict` when the email is already registered.

### Login customer

`POST /api/store/auth/login`

Authenticates a customer and sets the `store_auth_token` cookie.

Request body:

```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

Success response: `200 OK`

Error responses:

- `400 Bad Request` when email or password is missing.
- `401 Unauthorized` when credentials are invalid.

### Get current customer

`GET /api/store/auth/me`

Returns the currently authenticated customer.

Success response: `200 OK`

Error response:

- `401 Unauthorized` when the customer cookie is missing or invalid.

### Logout customer

`POST /api/store/auth/logout`

Deletes the `store_auth_token` cookie.

Success response: `200 OK`

```json
{
  "ok": true
}
```

### Checkout

`POST /api/store/checkout`

Creates a purchase for the authenticated customer and decrements stock.

Request body:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    }
  ]
}
```

Validation:

- Customer must be authenticated.
- `items` must be a non-empty array.
- Each item must reference an active product.
- Quantity must be greater than `0`.
- Product stock must be high enough for the requested quantity.

Success response: `201 Created`

Error responses:

- `400 Bad Request` for empty carts, missing products, or insufficient stock.
- `401 Unauthorized` when the customer cookie is missing or invalid.

### List customer purchases

`GET /api/store/purchases`

Returns purchases for the authenticated customer.

Success response: `200 OK`

Error response:

- `401 Unauthorized` when the customer cookie is missing or invalid.

### Seed database

`GET /api/seed`

Seeds the database with demo products, a demo customer, and a demo purchase.

This endpoint is only available when `E2E` is set.

Success response: `200 OK`

```json
{
  "message": "Seeded"
}
```

Error response:

- `501 Not Available` when `E2E` is not set.

## Admin API

### Login admin

`POST /api/auth`

Authenticates an admin user and sets the `auth_token` cookie.

This endpoint accepts either JSON or form data.

JSON request body:

```json
{
  "password": "admin-password"
}
```

Form data:

```txt
password=admin-password
```

Success response:

- Redirects to `/` and sets `auth_token`.

Failure response:

- Redirects to `/` without setting `auth_token`.

### Logout admin

`DELETE /api/auth`

Deletes the `auth_token` cookie.

Success response: `200 OK`

```json
{
  "message": "Logged out"
}
```

### List products

`GET /api/products`

Returns all products, including inactive products.

Success response: `200 OK`

Error response:

- `401 Unauthorized` when the admin cookie is missing or invalid.

### Create product

`POST /api/products`

Creates a product.

Request body:

```json
{
  "sku": "AUDIO-PULSE-01",
  "name": "Pulse Wireless Headphones",
  "description": "Noise-isolating over-ear headphones with 40 hours of battery.",
  "price": 129,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 18,
  "active": true
}
```

Validation:

- `sku`, `name`, `description`, `imageUrl`, and `category` must be strings.
- `price` must be a finite number greater than or equal to `0`.
- `stock` must be an integer greater than or equal to `0`.
- `active` is optional and defaults to `true`.

Success response: `201 Created`

Error responses:

- `400 Bad Request` when fields are missing, invalid, or the product cannot be created.
- `401 Unauthorized` when the admin cookie is missing or invalid.

### Get product

`GET /api/products/{sku}`

Returns one product by SKU.

Success response: `200 OK`

Error responses:

- `400 Bad Request` when the SKU is invalid.
- `401 Unauthorized` when the admin cookie is missing or invalid.
- `404 Not Found` when no product exists for the SKU.

### Update product

`PUT /api/products/{sku}`

Updates a product by SKU.

Request body:

```json
{
  "sku": "AUDIO-PULSE-01",
  "name": "Pulse Wireless Headphones",
  "description": "Noise-isolating over-ear headphones with 40 hours of battery.",
  "price": 129,
  "imageUrl": "https://example.com/image.jpg",
  "category": "Electronics",
  "stock": 18,
  "active": true
}
```

Validation:

- `name`, `description`, `imageUrl`, and `category` must be strings.
- `price` must be a finite number greater than or equal to `0`.
- `stock` must be an integer greater than or equal to `0`.
- `sku` is optional and defaults to the route SKU.
- `active` is optional and defaults to `true`.

Success response: `200 OK`

Error responses:

- `400 Bad Request` when fields are missing, invalid, or the product cannot be updated.
- `401 Unauthorized` when the admin cookie is missing or invalid.

### Delete product

`DELETE /api/products/{sku}`

Deletes a product by SKU. If the product cannot be physically deleted because of related purchase records, the product is marked inactive and stock is set to `0`.

Success response: `200 OK`

```json
{
  "ok": true
}
```

Error responses:

- `400 Bad Request` when the SKU is invalid or the product cannot be deleted.
- `401 Unauthorized` when the admin cookie is missing or invalid.

### List all purchases

`GET /api/purchases`

Returns all purchases across all customers.

Success response: `200 OK`

Error response:

- `401 Unauthorized` when the admin cookie is missing or invalid.
