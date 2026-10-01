import { prisma } from "../../config/db.js";
import redis from "../../config/redis.js";
import { getCacheMetrics } from "../../shared/utils/cache.js";
import { errorResponse } from "../../shared/utils/error-response.js";

export const healthCheck = async (req, res) => {
  let database = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (error) {
    database = "disconnected";
  }

  const redisStatus = redis.status === "ready" ? "connected" : redis.status;
  const healthy = database === "connected" && redisStatus === "connected";
  const statusCode = healthy ? 200 : 503;
  const response = {
    success: healthy,
    status: healthy ? "healthy" : "unhealthy",
    services: {
      database,
      redis: redisStatus,
    },
    cache: getCacheMetrics(),
    timestamp: new Date().toISOString(),
  };

  if (!healthy) {
    const failure = errorResponse(
      statusCode,
      "One or more required services are unavailable.",
    );
    response.code = failure.code;
    response.message = failure.message;
  }

  return res.status(statusCode).json(response);
};
