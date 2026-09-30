import app from "./app.js";
import logger from "./shared/utils/logger.js";

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  logger.info("HTTP server listening", { service: "http", port: Number(PORT), environment: process.env.NODE_ENV || "development" });
});
app.locals.httpServer = server;
