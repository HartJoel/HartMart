import { Worker } from "bullmq";
import redis from "../config/redis.js";

import PaymentWebhookService from "../modules/payment/payment.webhook.service.js";

const paymentWorker = new Worker(
  "payments",

  async (job) => {
    console.log(
      `Processing payment job ${job.id}`,
    );

    const { event } = job.data;

    return PaymentWebhookService.processEvent(event);
  },

  {
    connection: redis,
  },
);

paymentWorker.on("completed", (job, result) => {
  console.log(
    `Payment job ${job.id} completed`,
    result,
  );
});

paymentWorker.on("failed", (job, error) => {
  console.error(
    `Payment job ${job?.id} failed:`,
    error,
  );
});