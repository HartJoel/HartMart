import asyncHandler from "../../shared/utils/asyncHandler.js";
import PaymentService from "./payment.service.js";
import PaymentWebhookService from "./payment.webhook.service.js";
import logger from "../../shared/utils/logger.js";
import paymentQueue from "../../queues/payment.queue.js";
import { sendErrorResponse } from "../../shared/utils/error-response.js";

const initializePayment = asyncHandler(async (req, res) => {
  const requestMeta = {
    userId: req.user?.id,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
  };

  const payment = await PaymentService.initializePayment(
    req.user.id,
    req.body,
    requestMeta,
  );

  return res.status(201).json({
    success: true,
    data: payment,
  });
});

const confirmPayment = asyncHandler(async (req, res) => {
  const payment = await PaymentService.confirmPayment(
    req.user.id,
    req.params.paymentId,
  );

  return res.status(200).json({
    success: true,
    data: payment,
  });
});

const paystackWebhook = asyncHandler(async (req, res) => {
  try {
    const signature = req.headers["x-paystack-signature"];

    // IMPORTANT:
    // We want the original request body for signature verification.
    const rawBody = req.rawBody;

    if (!rawBody) {
      return sendErrorResponse(res, 400, "The raw request body is required to verify this webhook.");
    }

    const isValid = PaymentWebhookService.verifySignature(rawBody, signature);

    if (!isValid) {
      return sendErrorResponse(res, 401, "The Paystack webhook signature is invalid.");
    }

    // Don't process payment here.
    // Put it on the queue and immediately respond.
    await paymentQueue.add(
      "paystack-webhook",
      {
        event: req.body,
      },
      {
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    logger.error("Payment webhook request failed", { service: "payment", eventType: req.body?.event, ip: req.ip, userAgent: req.get("User-Agent"), errorMessage: error.message, stack: error.stack });

    return sendErrorResponse(res, 500, "The payment webhook could not be processed.");
  }
});

const getPayments = asyncHandler(async (req, res) => {
  const result = await PaymentService.getPayments(req.validatedQuery ?? req.query);

  return res.status(200).json({
    success: true,
    data: result.data,
    pagination: result.pagination,
  });
});

const getPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const payment = await PaymentService.getPaymentById(paymentId);

  return res.status(200).json({
    success: true,
    data: payment,
  });
});

export {
  initializePayment,
  confirmPayment,
  paystackWebhook,
  getPayments,
  getPayment,
};
