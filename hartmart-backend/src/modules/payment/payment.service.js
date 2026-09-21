import PaymentRepository from "./payment.repository.js";
import OrderRepository from "../order/order.repository.js";
import PaystackService from "../../integrations/paystack/paystack.service.js";
import crypto from "crypto";
import AppError from "../../shared/utils/AppError.js";

class PaymentService {
  static async initializePayment(userId, payload, requestMeta = {}) {
    const { orderId } = payload;

    // 1. Find order
    const order = await OrderRepository.findById(orderId);

    if (!order) {
      throw new AppError("Order not found", 404);
    }

    // 2. Make sure order belongs to user
    if (order.customerId !== userId) {
      throw new AppError("You cannot pay for this order", 403);
    }

    // 3. Check existing payment
    const existingPayment = await PaymentRepository.findByOrderId(orderId);

    // 4. Don't allow payment if already completed
    if (existingPayment && existingPayment.status === "COMPLETED") {
      throw new AppError("Order has already been paid", 400);
    }

    // 5. Generate a NEW reference for this attempt
    const reference = `PAY-${crypto.randomUUID()}`;

    // 6. Convert NGN to kobo
    const amount = Math.round(Number(order.totalAmount) * 100);

    let payment;

    if (existingPayment) {
      // RETRY
      payment = await PaymentRepository.updateById(existingPayment.id, {
        reference,
        status: "PENDING",
        attemptCount: {
          increment: 1,
        },

        ipAddress: requestMeta.ip,
        userAgent: requestMeta.userAgent,

        gatewayTransactionId: null,
        gatewayResponse: null,
      });
    } else {
      // FIRST PAYMENT ATTEMPT
      payment = await PaymentRepository.create({
        reference,
        orderId: order.id,
        userId,

        method: "PAYSTACK",
        amount: order.totalAmount,
        currency: "NGN",

        status: "PENDING",
        gateway: "paystack",

        attemptCount: 1,

        ipAddress: requestMeta.ipAddress,
        userAgent: requestMeta.userAgent,
      });
    }

    try {
      // 7. Initialize Paystack
      const paystackResponse = await PaystackService.initializeTransaction({
        email: order.customer.email,
        amount: amount.toString(),
        currency: "NGN",
        reference,

        metadata: JSON.stringify({
          paymentId: payment.id,
          orderId: order.id,
          userId,
          attemptCount: payment.attemptCount,
        }),
      });

      // 8. Save Paystack response
      const updatedPayment = await PaymentRepository.updateById(payment.id, {
        gatewayTransactionId: paystackResponse.data.reference,

        gatewayResponse: paystackResponse.data,

        status: "PENDING",
      });

      // 9. Return frontend data
      return {
        paymentId: updatedPayment.id,
        reference: paystackResponse.data.reference,
        authorizationUrl: paystackResponse.data.authorization_url,
        accessCode: paystackResponse.data.access_code,
        status: updatedPayment.status,
        attemptCount: updatedPayment.attemptCount,
      };
    } catch (error) {
      // Paystack initialization failed
      await PaymentRepository.updateById(payment.id, {
        status: "FAILED",

        gatewayResponse: {
          error: error.response?.data || error.message,
        },
      });

      throw new AppError(
        "Unable to initialize payment. Please try again.",
        502,
      );
    }
  }

  static async confirmPayment(userId, paymentId) {
    // 1. Find payment
    const payment = await PaymentRepository.findById(paymentId);

    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    // 2. Make sure payment belongs to user
    if (payment.userId !== userId) {
      throw new AppError("You cannot confirm this payment", 403);
    }

    // 3. Make sure this is a Paystack payment
    if (payment.gateway !== "paystack") {
      throw new AppError("This payment is not a Paystack payment", 400);
    }

    // 4. Don't verify an already completed payment
    if (payment.status === "COMPLETED") {
      return {
        paymentId: payment.id,
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paidAt: payment.paidAt,
      };
    }

    // 5. Verify transaction with Paystack
    const verification = await PaystackService.verifyTransaction(
      payment.reference,
    );

    // 6. Check Paystack response
    if (!verification.status) {
      throw new AppError("Unable to verify payment", 400);
    }

    const transaction = verification.data;

    // 7. Make sure transaction was actually successful
    if (transaction.status !== "success") {
      const updatedPayment = await PaymentRepository.updateById(payment.id, {
        gatewayTransactionId: transaction.id?.toString(),
        gatewayResponse: transaction,
      });

      return {
        paymentId: payment.id,
        reference: payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        status: "PENDING",
        paidAt: null,
      };
    }

    // 8. Verify amount
    const expectedAmount = Math.round(Number(payment.amount) * 100);

    if (Number(transaction.amount) !== expectedAmount) {
      throw new AppError("Payment amount does not match order amount", 400);
    }

    // 9. Payment successful
    const updatedPayment = await PaymentRepository.updateById(payment.id, {
      status: "COMPLETED",
      gatewayTransactionId: transaction.id?.toString(),
      // gatewayResponse: transaction,
      paidAt: new Date(),
    });

    return {
      paymentId: updatedPayment.id,
      reference: updatedPayment.reference,
      amount: updatedPayment.amount,
      currency: updatedPayment.currency,
      status: updatedPayment.status,
      paidAt: updatedPayment.paidAt,
    };
  }

 static async getPayments(query) {
  const result = await PaymentRepository.findAll(query);

  const payments = result.data ?? result;

  const formattedPayments = payments.map((payment) => ({
    id: payment.id,
    reference: payment.reference,
    orderId: payment.orderId,
    amount: payment.amount,
    currency: payment.currency,
    method: payment.method,
    status: payment.status,
    gateway: payment.gateway,
    gatewayTransactionId: payment.gatewayTransactionId,
    attemptCount: payment.attemptCount,
    paidAt: payment.paidAt,
    createdAt: payment.createdAt,
  }));

  return {
    data: formattedPayments,
    pagination: result.pagination,
  };
}

  static async getPaymentById(id) {
    const payment = await PaymentRepository.findById(id);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return {
      id: payment.id,
      reference: payment.reference,
      orderId: payment.orderId,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      gateway: payment.gateway,
      gatewayTransactionId: payment.gatewayTransactionId,
      attemptCount: payment.attemptCount,
      last4: payment.last4,
      cardBrand: payment.cardBrand,
      paidAt: payment.paidAt,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}

export default PaymentService;
