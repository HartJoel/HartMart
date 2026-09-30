import asyncHandler from "../../shared/utils/asyncHandler.js";
import PaymentService from "./payment.service.js";
import PaymentWebhookService from "./payment.webhook.service.js";
import logger from "../../shared/utils/logger.js";
import paymentQueue from "../../queues/payment.queue.js";

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
      return res.status(400).json({
        success: false,
        message: "Raw request body is required",
      });
    }

    const isValid = PaymentWebhookService.verifySignature(rawBody, signature);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid Paystack signature",
      });
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

    return res.status(500).json({
      success: false,
    });
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
