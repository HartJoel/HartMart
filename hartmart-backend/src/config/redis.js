import "dotenv/config";
import Redis from "ioredis";
import logger from "../shared/utils/logger.js";

const redisUrl = process.env.REDIS_URL;

const redis = new Redis(redisUrl || {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: 1,
  enableOfflineQueue: false,
  connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS) || 5000,
  retryStrategy: (attempt) => Math.min(attempt * 250, 3000),
});

redis.on("connect", () => logger.info("Redis connected"));
redis.on("ready", () => logger.info("Redis ready"));
redis.on("reconnecting", (delay) => logger.warn("Redis reconnecting", { delayMs: delay }));
redis.on("end", () => logger.warn("Redis connection ended"));

redis.on("error", (error) => {
  logger.error("Redis error", { errorMessage: error.message, errorCode: error.code });
});

export default redis;
