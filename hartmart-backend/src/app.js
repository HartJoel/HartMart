import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/auth/user.routes.js";
import refreshRoutes from "./modules/auth/refresh.routes.js";
import addressRoutes from "./modules/address/address.routes.js";
import vendorRoutes from "./modules/vendor/vendor.routes.js";
import categoryRoutes from "./modules/category/category.routes.js";
import productRoutes from "./modules/product/product.routes.js";
import cartRoutes from "./modules/cart/cart.routes.js";
import wishLists from "./modules/wishlist/wishlist.routes.js";
import orderRoutes from "./modules/order/order.routes.js";
import reviewRoutes from "./modules/review/review.routes.js";
import healthRoutes from "./modules/health/health.routes.js";
import notificationRoutes from "./modules/notification/notification.routes.js";
import errorMiddleware from "./shared/middleware/error.middleware.js";
import adminRoutes from "./modules/admin/admin.routes.js";

config();
connectDB();

const app = express();

// Body parsing middlwares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/v1/auth", authRoutes);
app.use("/v1/users", userRoutes);
app.use("/v1/addresses", addressRoutes);
app.use("/v1/auth", refreshRoutes);
app.use("/v1/vendor", vendorRoutes);
app.use("/v1/category", categoryRoutes);
app.use("/v1/products", productRoutes);
app.use("/v1/carts", cartRoutes);
app.use("/v1/wishlists", wishLists);
app.use("/v1/orders", orderRoutes);
app.use("/v1/reviews", reviewRoutes);
app.use("/v1/notification", notificationRoutes);
app.use("/v1/admin", adminRoutes);
app.use("/api", healthRoutes);

app.use(errorMiddleware);

// Handle unhandled promise rejections (e.g., database connection errors)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  server.close(async () => {
    await disconnectDB();
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await disconnectDB();
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
});

export default app;
