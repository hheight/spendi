# Spendi

Expense tracker application built for fun using [Next.js 16](https://nextjs.org/docs), [Prisma Postgres](https://www.prisma.io/docs/postgres) database and [Vitest](https://vitest.dev), [Playwright](https://playwright.dev) testing frameworks. 
The goal is to explore full-stack application development with mentioned technologies.

Demo: https://spendi-two.vercel.app/

You can use a test account or create a new one:

```
email: test@spendi.com
password: test1234
```

## Local development with Docker

Create a Docker Volume and run a container with postgres image. For instance:
```
docker volume create spendi-dev_db
docker run --name=spendi-dev-pg -d -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5434:5432 -v spendi-dev_db:/var/lib/postgresql/data postgres:14.19
```

Create `.env` file with `DATABASE_URL` (depending on the previous `docker run` command) and `SESSION_SECRET` variables:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/dev?schema=public"
SESSION_SECRET="super_secret"
```

Run the commands to generate Prisma Client and run the migrations:

```
npx prisma generate
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
