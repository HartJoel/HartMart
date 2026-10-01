# HartMart Backend

HartMart Backend is a Node.js REST API for the HartMart marketplace. It is built with Express, PostgreSQL, Prisma, and Redis. Redis is used for caching and background payment jobs.

## Requirements

- Node.js 22 or newer and npm
- PostgreSQL
- Redis (or a compatible service such as Render Key Value)

Alternatively, use Docker Desktop with Docker Compose to start the API and local PostgreSQL and Redis containers.

## Configuration

Create a `.env` file in the project root. Never commit this file or put real credentials in source control. At minimum, configure:

```env
PORT=5001
NODE_ENV=development
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_REFRESH_SECRET="replace-with-a-different-long-random-secret"

# Local development:
REDIS_HOST=localhost
REDIS_PORT=6379
# Or provide one Redis connection URL instead:
# REDIS_URL=redis://localhost:6379
```

Depending on which integrations you use, you may also need `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `PAYSTACK_SECRET_KEY`. Optional cache settings include `CACHE_ENABLED`, `CACHE_KEY_PREFIX`, `CACHE_OPERATION_TIMEOUT_MS`, and the `CACHE_TTL_*_SECONDS` values. `LOG_LEVEL` controls logging verbosity.

## Run locally

Install dependencies and generate the Prisma client:

```sh
npm ci
npx prisma generate
```

Make sure PostgreSQL and Redis are running and that the connection settings in `.env` point to them. Apply checked-in database migrations:

```sh
npm run db:deploy
```

Start the API in development mode (restarts when files change):

```sh
npm run dev
```

The API listens on `http://localhost:5001` by default. Check its health at [`http://localhost:5001/api/health`](http://localhost:5001/api/health). The health response reports whether the database and Redis are connected.

To run the payment queue worker in a second terminal, use:

```sh
npm run worker
```

## Run with Docker Compose

Docker Compose starts the API, PostgreSQL, and Redis. It waits for the database and Redis health checks, applies Prisma migrations, and then starts the API.

```sh
docker compose up --build
```

Open `http://localhost:5001/api/health`. Stop the containers with **Ctrl+C**, or use `docker compose down` from another terminal. PostgreSQL and Redis data are stored in named Docker volumes and remain when the containers stop. To delete the volumes and their data, use `docker compose down -v`.

Compose reads `.env` from the project root. If `DATABASE_URL` is set there, Compose passes that URL to the API; otherwise it uses the local PostgreSQL container. For the local container, set:

```env
DATABASE_URL="postgresql://hartmart:hartmart@postgres:5432/hartmart?schema=public"
```

The hostname `postgres` works between Compose containers. From a tool running directly on your computer, use `localhost` instead. The API reaches Compose Redis internally at `redis:6379`; Redis does not need a published host port.

## Deploy to Render

Deploy the API as a Render **Web Service** using the repository's Dockerfile. Render does not use this local `docker-compose.yml` to provision the supporting services, so create a Render PostgreSQL database and a Render **Key Value** instance separately.

Configure these environment variables on the Render web service:

- `DATABASE_URL`: the connection string for your production PostgreSQL database.
- `REDIS_URL`: the Key Value **internal URL** from its Connect menu.
- `JWT_SECRET` and `JWT_REFRESH_SECRET`: separate, strong secret values.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, and `PAYSTACK_SECRET_KEY` if those integrations are enabled.

Keep the web service and Key Value instance in the same Render region and use the internal Redis URL. Do not set `REDIS_HOST=localhost` or `REDIS_PORT=6379` on Render: `localhost` refers to the web service container, not a Redis server on your computer. The local `.env` file is excluded from the Docker image; configure production secrets in the Render dashboard. The Docker image runs `prisma migrate deploy` before starting the API.

The Docker image starts the HTTP API. If payment queue processing is required, also deploy a Render **Background Worker** from this repository with the same database, Redis, and integration environment variables, and set its start command to:

```sh
npm run worker
```

The worker and web service should use the same Redis instance so they share the payment queue.

## API routes

Routes are grouped under `/v1`, including authentication, users, addresses, vendors, categories, products, carts, wishlists, orders, reviews, notifications, admin, and payments. The service health route is `/api/health`.

## Tests

Run the full test suite with:

```sh
npm test
```

Unit and integration tests can be run separately with `npm run test:unit` and `npm run test:integration`.
