# Auth tests

Run unit tests without a database:

```sh
npm run test:unit
```

The Supertest HTTP integration tests exercise the real auth routes, request
validation, controllers, services, Prisma repository, and database. Point them
at a dedicated migrated test database; the setup refuses a database name that
does not contain `test` or `testing`:

PowerShell example:

```powershell
$env:TEST_DATABASE_URL = "postgresql://user:password@localhost:5432/hartmart_test"
npm.cmd run test:integration
```

Create the database and apply your Prisma migrations to it before running the
integration suite. `TEST_DATABASE_URL` is copied to `DATABASE_URL` for the test
process so the application Prisma client uses the isolated test database.

The integration cleanup only deletes users whose email starts with
`auth-vitest-`. Refresh tokens are removed by the user relation's cascade rule.
No test truncates tables or removes data outside that prefix.

Run the unit suite and any configured integration tests with:

```sh
npm test
```

If `TEST_DATABASE_URL` is unset, integration tests are skipped and unit tests
still run.
