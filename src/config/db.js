import { PrismaClient } from "@prisma/client";
import logger from "../shared/utils/logger.js";

const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("Database connection established", { service: "database", provider: "prisma" });
  } catch (error) {
    logger.error("Database connection failed", { service: "database", errorMessage: error.message, stack: error.stack });
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectDB, disconnectDB };
