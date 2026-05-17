# B2C Store Application

This project is a Turborepo with:

- `apps/web`: customer-facing Next.js app.
- `apps/admin`: admin Next.js app.
- `packages/db`: Prisma database package using SQLite for local development.

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create local env files from the examples:

- `apps/web/.env.example` -> `apps/web/.env.local`
- `apps/admin/.env.example` -> `apps/admin/.env.local`
- `packages/db/.env.example` -> `packages/db/.env`

For this local workspace, the dev database URL is:

```env
DATABASE_URL="file:C:/Users/phuon/OneDrive/Desktop/uni/FULLSTACK/B2C-Store-Application/packages/db/prisma/dev.db"
```

The admin app also needs:

```env
PASSWORD="123"
JWT_SECRET="local-development-secret"
```

Prepare the database:

```bash
cd packages/db
pnpm db:generate
pnpm db:push
```

Seed data can be loaded from the web app in E2E mode or by importing `seed()` from `@repo/db/seed`.

Run the apps:

```bash
pnpm dev
```

Customer app: http://localhost:3001

Admin app: http://localhost:3002

## Store Backend

The backend includes:

- Product and category APIs for browsing, search, and filtering.
- Customer registration, login, logout, and session lookup.
- Mock checkout with paid purchase records and stock decrementing.
- Customer purchase history.
- Admin product management APIs.
- Admin purchase history API.
