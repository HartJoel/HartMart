import { AUTH_TEST_EMAIL_PREFIX } from "./auth.factory.js";

/**
 * Remove only users created by this auth test suite. User-owned refresh tokens
 * are deleted by the schema's onDelete: Cascade relation.
 */
export async function cleanupAuthTestData(prisma) {
  await prisma.user.deleteMany({
    where: {
      email: { startsWith: AUTH_TEST_EMAIL_PREFIX },
    },
  });
}
