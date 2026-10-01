import "dotenv/config";
import Redis from "ioredis";

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


export default redis;
