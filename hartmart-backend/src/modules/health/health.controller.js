import { prisma } from "../../config/db.js";

export const healthCheck = async (req, res) => {
  let database = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "disconnected";
  }

  return res.status(200).json({
    status: database === "connected" ? "healthy" : "unhealthy",
    services: {
      database,
    },
    timestamp: new Date().toISOString(),
  });
};
