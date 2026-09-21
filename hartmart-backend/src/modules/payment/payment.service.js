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
  const existingPayment =
    await PaymentRepository.findByOrderId(orderId);

  // 4. Don't allow payment if already completed
  if (
    existingPayment &&
    existingPayment.status === "COMPLETED"
  ) {
    throw new AppError("Order has already been paid", 400);
  }

  // 5. Generate a NEW reference for this attempt
  const reference = `PAY-${crypto.randomUUID()}`;

  // 6. Convert NGN to kobo
  const amount = Math.round(
    Number(order.totalAmount) * 100
  );

  let payment;

  if (existingPayment) {
    // RETRY
    payment = await PaymentRepository.updateById(
      existingPayment.id,
      {
        reference,
        status: "PENDING",
        attemptCount: {
          increment: 1,
        },

        ipAddress: requestMeta.ip,
        userAgent: requestMeta.userAgent,

        gatewayTransactionId: null,
        gatewayResponse: null,
      }
    );
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
    const paystackResponse =
      await PaystackService.initializeTransaction({
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
    const updatedPayment =
      await PaymentRepository.updateById(payment.id, {
        gatewayTransactionId:
          paystackResponse.data.reference,

        gatewayResponse:
          paystackResponse.data,

        status: "PENDING",
      });

    // 9. Return frontend data
    return {
      paymentId: updatedPayment.id,
      reference: paystackResponse.data.reference,
      authorizationUrl:
        paystackResponse.data.authorization_url,
      accessCode:
        paystackResponse.data.access_code,
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
      502
    );
  }
}
}

export default PaymentService;
