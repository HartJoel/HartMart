import crypto from "crypto";
import PaymentRepository from "./payment.repository.js";
import AppError from "../../shared/utils/AppError.js";
import OrderRepository from "../order/order.repository.js";
import EventService from "../../events/eventService.js";
import EventTypes from "../../events/eventTypes.js";
import logger from "../../shared/utils/logger.js";

class PaymentWebhookService {
  /**
   * Verify that the webhook actually came from Paystack.
   */
  static verifySignature(rawBody, signature) {
    if (!signature) {
      return false;
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;

    if (!secretKey) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured");
    }

    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(rawBody)
      .digest("hex");

    if (hash.length !== signature.length) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(hash),
      Buffer.from(signature),
    );
  }

  /**
   * Process a verified Paystack event.
   *
   * This method runs inside the queue worker.
   */
  static async processEvent(event) {
    switch (event.event) {
      case "charge.success":
        return this.handleChargeSuccess(event);

      case "charge.failed":
        return this.handleChargeFailed(event);

      default:
        // We received a valid Paystack event,
        // but it's not one our payment system needs.
        return {
          handled: false,
          event: event.event,
        };
    }
  }

  /**
   * Handle successful Paystack transaction.
   */
  static async handleChargeSuccess(event) {
    const transaction = event.data;

    if (!transaction) {
      throw new AppError("Invalid Paystack webhook payload", 400);
    }

    const reference = transaction.reference;

    if (!reference) {
      throw new AppError(
        "Paystack webhook does not contain a reference",
        400,
      );
    }

    // 1. Find our payment
    const payment = await PaymentRepository.findByReference(reference);

    if (!payment) {
      throw new AppError(
        `Payment not found for reference ${reference}`,
        404,
      );
    }

    // 2. Idempotency
    //
    // Paystack can send the same webhook more than once.
    // Don't process a payment that's already completed.
    if (payment.status === "COMPLETED") {
      logger.info("Duplicate successful payment webhook ignored", { paymentId: payment.id, orderId: payment.orderId, reference });
      return {
        handled: true,
        duplicate: true,
        paymentId: payment.id,
        reference: payment.reference,
      };
    }

    // 3. Make sure this is our Paystack payment
    if (payment.gateway !== "paystack") {
      throw new AppError(
        "Payment gateway does not match Paystack",
        400,
      );
    }

    // 4. Make sure Paystack says the transaction succeeded
    if (transaction.status !== "success") {
      return {
        handled: true,
        paymentId: payment.id,
        reference,
        status: transaction.status,
      };
    }

    // 5. Validate currency
    if (transaction.currency !== payment.currency) {
      throw new AppError(
        "Payment currency does not match",
        400,
      );
    }

    // 6. Validate amount
    //
    // Our DB stores NGN.
    // Paystack sends amount in kobo.
    const expectedAmount = Math.round(
      Number(payment.amount) * 100,
    );

    if (Number(transaction.amount) !== expectedAmount) {
      throw new AppError(
        "Payment amount does not match order amount",
        400,
      );
    }

    // 7. Mark payment as completed
    const updatedPayment = await PaymentRepository.updateById(
      payment.id,
      {
        status: "COMPLETED",

        gatewayTransactionId:
          transaction.id?.toString(),

        gatewayResponse: transaction,

        paidAt: transaction.paid_at
          ? new Date(transaction.paid_at)
          : new Date(),
      },
    );

    const order = await OrderRepository.findById(updatedPayment.orderId);
    EventService.emit(EventTypes.PAYMENT_RECEIVED, { payment: updatedPayment, order, userId: updatedPayment.userId });
    logger.info("Payment completed from webhook", { paymentId: updatedPayment.id, orderId: updatedPayment.orderId, userId: updatedPayment.userId, amount: Number(updatedPayment.amount), currency: updatedPayment.currency });

    // 8. Update order
    //
    // Add your actual order status method here.
    //
    // Example:
    //
    // await OrderRepository.updateById(payment.orderId, {
    //   paymentStatus: "PAID",
    //   status: "PROCESSING",
    // });

    return {
      handled: true,
      duplicate: false,
      paymentId: updatedPayment.id,
      orderId: updatedPayment.orderId,
      reference: updatedPayment.reference,
      status: updatedPayment.status,
    };
  }

  static async handleChargeFailed(event) {
    const reference = event.data?.reference;
    if (!reference) throw new AppError("Paystack webhook does not contain a reference", 400);

    const payment = await PaymentRepository.findByReference(reference);
    if (!payment) throw new AppError(`Payment not found for reference ${reference}`, 404);

    if (payment.status === "COMPLETED") {
      logger.info("Failure webhook ignored for completed payment", { paymentId: payment.id, orderId: payment.orderId, reference });
      return { handled: true, duplicate: true, paymentId: payment.id, reference };
    }

    const updatedPayment = await PaymentRepository.updateById(payment.id, {
      status: "FAILED",
      gatewayTransactionId: event.data.id?.toString(),
      gatewayResponse: event.data,
    });
    const order = await OrderRepository.findById(updatedPayment.orderId);
    EventService.emit(EventTypes.PAYMENT_FAILED, { payment: updatedPayment, order, userId: updatedPayment.userId });
    logger.warn("Payment failed from webhook", { paymentId: updatedPayment.id, orderId: updatedPayment.orderId, userId: updatedPayment.userId, status: updatedPayment.status });

    return { handled: true, paymentId: updatedPayment.id, reference, status: updatedPayment.status };
  }
}

export default PaymentWebhookService;
