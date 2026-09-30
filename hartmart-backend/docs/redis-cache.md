# Redis cache policy

The cache is opt-in by default-on behavior and fails open: database reads and writes continue when Redis is unavailable. Set `CACHE_ENABLED=false` to bypass caching. Cache entries use `<CACHE_KEY_PREFIX>:v1:<namespace>:<generation>:<sha256(identity)>`; user identifiers and query contents are never written into Redis key names or cache logs.

## Cached reads

| Data | Default TTL | Invalidation |
| --- | ---: | --- |
| Current user safe profile (`/users/me`) | 3600 seconds | Profile update and vendor role change |
| User detail | 3600 seconds | Profile update and vendor role change |
| Product detail | 120 seconds | Product create, edit, stock update, and delete |
| Product listing | 30 seconds | Product create, edit, stock update, and delete |
| Category list and detail | 300 / 30 seconds | Category create, edit, delete; product changes also invalidate category detail |

Cache misses use cache-aside reads and coalesce identical loads within a Node process. Namespace generation keys invalidate entries without scanning or deleting broad Redis key patterns. Entries have TTLs as a bound on staleness if a write path bypasses the service invalidation hooks.

Carts, wishlists, stock reservation/availability workflows, orders, payments, notifications, auth/session data, analytics, and paginated user listings remain uncached because they are user-specific, sensitive, rapidly changing, or require read-after-write freshness. Profile cache payloads omit password hashes and never contain auth tokens.

## Configuration

| Variable | Default |
| --- | --- |
| `CACHE_ENABLED` | `true` |
| `CACHE_KEY_PREFIX` | `hartmart` |
| `CACHE_OPERATION_TIMEOUT_MS` | `300` |
| `CACHE_TTL_USER_PROFILE_SECONDS` | `3600` |
| `CACHE_TTL_PRODUCT_DETAIL_SECONDS` | `120` |
| `CACHE_TTL_PRODUCT_LIST_SECONDS` | `30` |
| `CACHE_TTL_CATEGORY_DETAIL_SECONDS` | `30` |
| `CACHE_TTL_CATEGORY_LIST_SECONDS` | `300` |
| `REDIS_URL` | unset; use host/port below |
| `REDIS_HOST` / `REDIS_PORT` | `localhost` / `6379` |
| `REDIS_PASSWORD` | unset |
| `REDIS_CONNECT_TIMEOUT_MS` | `5000` |

The `/api/health` response includes process-local cache hit/miss/set/invalidation/error counts, hit rate, average Redis command latency, and invalidation counts by namespace. Structured logs record cache operations using namespace only. For multi-instance monitoring, aggregate these health metrics or logs in the deployment monitoring system; counters reset when a process restarts.
