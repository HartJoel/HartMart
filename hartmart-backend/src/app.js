import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import { connectDB, disconnectDB } from "./config/db.js";

// Import Routes
import authRoutes from "./v1/routes/auth.routes.js";
import userRoutes from "./v1/routes/user.routes.js";
import refreshRoutes from "./v1/routes/refresh.routes.js";
import addressRoutes from "./v1/routes/address.route.js";
import vendorRoutes from "./v1/routes/vendor.route.js";
import categoryRoutes from "./v1/routes/category.route.js";
import productRoutes from "./v1/routes/product.route.js";
import cartRoutes from "./v1/routes/cart.route.js";
import wishLists from "./v1/routes/wishlist.route.js";
import orderRoutes from "./v1/routes/order.route.js";
import reviewRoutes from "./v1/routes/review.route.js";
import notificationRoutes from "./v1/routes/notification.route.js";
import errorMiddleware from "./v1/middleware/error.middleware.js";

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
