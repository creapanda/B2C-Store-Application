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

- `.env.example` -> `.env`
- `apps/web/.env.example` -> `apps/web/.env.local`
- `apps/admin/.env.example` -> `apps/admin/.env.local`
- `packages/db/.env.example` -> `packages/db/.env`

For this local workspace, the dev database URL is:

```env
DATABASE_URL="file:C:/Users/phuon/Desktop/2026 autumn subject/full stack dev/B2C-Store-Application/packages/dev.db"
```

The admin app also needs:

```env
PASSWORD="123"
JWT_SECRET="PhuongDavidCreapanda"
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

## Vercel Deployment

Deploy the customer app and admin app as two Vercel projects from the same GitHub repo.

Customer project settings:

- Root Directory: `apps/web`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo build --filter=@repo/web`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`
- Output Directory: leave empty

Admin project settings:

- Root Directory: `apps/admin`
- Framework Preset: Next.js
- Build Command: `cd ../.. && pnpm turbo build --filter=@repo/admin`
- Install Command: `cd ../.. && pnpm install --frozen-lockfile`
- Output Directory: leave empty

Required Vercel environment variables:

```env
DATABASE_URL="file:./dev.db"
PASSWORD="admin123"
JWT_SECRET="use-a-long-random-secret"
```

The build log failure `PASSWORD` and `JWT_SECRET` means those variables were missing in Vercel. Add them in Project Settings -> Environment Variables for Production, Preview, and Development.

If Vercel says `No Output Directory named "public" found`, open Project Settings -> Build and Output Settings and remove `public` from Output Directory. This is a Next.js app, so Vercel should use its default Next output instead of a static `public` folder.

Note: SQLite is fine for local assignment demos, but Vercel serverless deployments do not provide a persistent writable SQLite database. For a real deployed store with saved purchases, move Prisma to a hosted database such as Vercel Postgres, Neon, Supabase, or Railway.

## Store Backend

The backend includes:

- Product and category APIs for browsing, search, and filtering.
- Customer registration, login, logout, and session lookup.
- Mock checkout with paid purchase records and stock decrementing.
- Customer purchase history.
- Admin product management APIs.
- Admin purchase history API.
