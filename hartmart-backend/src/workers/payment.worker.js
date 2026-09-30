import { Worker } from "bullmq";
import redis from "../config/redis.js";
import logger from "../shared/utils/logger.js";

import PaymentWebhookService from "../modules/payment/payment.webhook.service.js";

const paymentWorker = new Worker(
  "payments",

  async (job) => {
    logger.info("Payment webhook job started", { service: "payment-worker", jobId: job.id, attempt: job.attemptsMade + 1 });

    const { event } = job.data;

    return PaymentWebhookService.processEvent(event);
  },

  {
    connection: redis,
  },
);

paymentWorker.on("completed", (job, result) => {
  logger.info("Payment webhook job completed", { service: "payment-worker", jobId: job.id });
});

paymentWorker.on("failed", (job, error) => {
  logger.error("Payment webhook job failed", { service: "payment-worker", jobId: job?.id, errorMessage: error.message, stack: error.stack });
});
