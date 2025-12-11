# Spendi

Expense tracker application built for fun with [Next.js 15](https://nextjs.org/docs/15/app/getting-started) and [Prisma Postgres](https://www.prisma.io/docs/postgres) database.

Demo: https://spendi-kappa.vercel.app

You can use a test account or create a new one:

```
email: test@spendi.com
password: test1234
```

## Local development

Node.js v20 or later is required for local Prisma Postgres.

Create `.env` file with `DATABASE_URL` and `SESSION_SECRET` variables:

```
DATABASE_URL="dev"
SESSION_SECRET="super_secret"
```

Start the local Prisma Postgres server using the following command:

```
npx prisma dev
```

Hit `h` on your keyboard, copy the `DATABASE_URL` and store it in your `.env` file. This will be used to connect to the local Prisma Postgres server:

```
DATABASE_URL="prisma+postgres://localhost:51213/?api_key=__API_KEY__"
```

Then, in a separate terminal tab, run the command to create the database and run the migrations:

```
npx prisma migrate dev
```

Finally, start the dev server:

```
npm run dev
```

## Running tests with Docker

Create `.env.test` file:

```
DATABASE_URL="postgresql://prisma:prisma@localhost:5433/tests"
SESSION_SECRET="super_secret"
PORT=3001
```

With Docker running, use the following commands:

```
# Unit
npm run test:unit

# Integration
npm run test:int

# E2E
npm run test:e2e
```
