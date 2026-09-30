process.env.NODE_ENV = "test";
process.env.JWT_SECRET ??= "vitest-access-secret-for-tests";
process.env.JWT_REFRESH_SECRET ??= "vitest-refresh-secret-for-tests";

const testDatabaseUrl = process.env.TEST_DATABASE_URL;

if (testDatabaseUrl) {
  const databaseName = decodeURIComponent(new URL(testDatabaseUrl).pathname)
    .replace(/^\/+/, "");

  if (!/test|testing/i.test(databaseName)) {
    throw new Error(
      "TEST_DATABASE_URL must point to a database whose name includes 'test' or 'testing'.",
    );
  }

  // The application's Prisma singleton reads DATABASE_URL when it is imported.
  process.env.DATABASE_URL = testDatabaseUrl;
}
