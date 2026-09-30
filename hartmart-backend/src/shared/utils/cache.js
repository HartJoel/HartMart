import crypto from "crypto";
import redis from "../../config/redis.js";
import logger from "./logger.js";

const prefix = (process.env.CACHE_KEY_PREFIX || "hartmart").replace(/:+$/, "");
const enabled = process.env.CACHE_ENABLED !== "false";
const operationTimeoutMs = Number(process.env.CACHE_OPERATION_TIMEOUT_MS) || 300;
const inFlight = new Map();
const metrics = { hits: 0, misses: 0, sets: 0, invalidations: 0, errors: 0, redisOperations: 0, redisLatencyTotalMs: 0, invalidationsByNamespace: {} };

const timeout = (promise) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error("Cache operation timed out")), operationTimeoutMs);
  promise.then(resolve, reject).finally(() => clearTimeout(timer));
});

const serializeParts = (parts) => JSON.stringify(parts);
const digest = (value) => crypto.createHash("sha256").update(value).digest("hex");
const baseKey = (namespace) => `${prefix}:v1:${namespace}`;

async function safeRedis(operation, details, fallback) {
  const startedAt = Date.now();
  try {
    return await timeout(operation());
  } catch (error) {
    metrics.errors += 1;
    logger.warn("Cache operation failed", { ...details, errorMessage: error.message });
    return fallback;
  } finally {
    metrics.redisOperations += 1;
    metrics.redisLatencyTotalMs += Date.now() - startedAt;
  }
}

export async function getOrSetCache(namespace, parts, ttlSeconds, loader) {
  if (!enabled || !Number.isFinite(ttlSeconds) || ttlSeconds <= 0) return loader();

  const generationKey = `${baseKey(namespace)}:generation`;
  const generation = await safeRedis(() => redis.get(generationKey), { operation: "generation_read", namespace }, null);
  const identity = digest(serializeParts(parts));
  const cacheKey = `${baseKey(namespace)}:${generation || "0"}:${identity}`;
  const cached = await safeRedis(() => redis.get(cacheKey), { operation: "get", namespace }, null);
  if (cached !== null) {
    try {
      metrics.hits += 1;
      logger.info("Cache hit", { namespace });
      return JSON.parse(cached);
    } catch (error) {
      await safeRedis(() => redis.del(cacheKey), { operation: "corrupt_entry_delete", namespace }, null);
    }
  }

  metrics.misses += 1;
  logger.info("Cache miss", { namespace });
  if (inFlight.has(cacheKey)) return inFlight.get(cacheKey);

  const pending = (async () => {
    const value = await loader();
    if (value !== undefined) {
      const stored = await safeRedis(() => redis.set(cacheKey, JSON.stringify(value), "EX", ttlSeconds), { operation: "set", namespace }, null);
      if (stored === "OK") {
        metrics.sets += 1;
        logger.info("Cache set", { namespace, ttlSeconds });
      }
    }
    return value;
  })().finally(() => inFlight.delete(cacheKey));
  inFlight.set(cacheKey, pending);
  return pending;
}

export async function invalidateCache(namespace) {
  if (!enabled) return;
  const key = `${baseKey(namespace)}:generation`;
  const result = await safeRedis(() => redis.incr(key), { operation: "invalidate", namespace }, null);
  if (result !== null) {
    metrics.invalidations += 1;
    metrics.invalidationsByNamespace[namespace] = (metrics.invalidationsByNamespace[namespace] || 0) + 1;
    logger.info("Cache invalidated", { namespace });
  }
}

export function getCacheMetrics() {
  const lookups = metrics.hits + metrics.misses;
  return { ...metrics, enabled, invalidationsByNamespace: { ...metrics.invalidationsByNamespace }, hitRate: lookups ? Number((metrics.hits / lookups).toFixed(4)) : 0, averageRedisLatencyMs: metrics.redisOperations ? Number((metrics.redisLatencyTotalMs / metrics.redisOperations).toFixed(2)) : 0 };
}

export const cacheTtl = Object.freeze({
  userProfile: Number(process.env.CACHE_TTL_USER_PROFILE_SECONDS) || 3600,
  productDetail: Number(process.env.CACHE_TTL_PRODUCT_DETAIL_SECONDS) || 120,
  productList: Number(process.env.CACHE_TTL_PRODUCT_LIST_SECONDS) || 30,
  categoryDetail: Number(process.env.CACHE_TTL_CATEGORY_DETAIL_SECONDS) || 30,
  categoryList: Number(process.env.CACHE_TTL_CATEGORY_LIST_SECONDS) || 300,
});
