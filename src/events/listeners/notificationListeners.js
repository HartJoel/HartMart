import NotificationService from "../../modules/notification/notification.service.js";
import VendorRepository from "../../modules/vendor/vendor.repository.js";
import EventService from "../eventService.js";
import EventTypes from "../eventTypes.js";

export default function registerNotificationListeners() {
  EventService.on(
    EventTypes.ORDER_CREATED,
    async ({ order, orderItems, customerId }) => {
      // Customer
      await NotificationService.create({
        userId: customerId,
        type: "ORDER_CREATED",
        title: "Order placed successfully",
        message: `Your order ${order.orderNumber} has been placed.`,
        actionUrl: `/orders/${order.id}`,
        metadata: {
          orderId: order.id,
        },
      });

      // Vendors
      const vendorIds = [
        ...new Set(orderItems.map((item) => item.vendorId).filter(Boolean)),
      ];

      for (const vendorId of vendorIds) {
        const vendor = await VendorRepository.findById(vendorId);

        if (!vendor) continue;

        await NotificationService.create({
          userId: vendor.userId,
          type: "NEW_ORDER",
          title: "New Order Received",
          message: "You have received a new order.",
          actionUrl: `/vendor/orders/${order.id}`,
          metadata: {
            orderId: order.id,
          },
        });
      }
    },
  );

  EventService.on(
    EventTypes.PAYMENT_RECEIVED,
    async ({ payment, order, userId }) => {
      await NotificationService.create({
        userId,
        type: "PAYMENT_RECEIVED",
        title: "Payment successful",
        message: `Your payment for order ${order.orderNumber} was successful.`,
        actionUrl: `/orders/${order.id}`,
        metadata: {
          orderId: order.id,
          paymentId: payment.id,
        },
      });
    },
  );

  EventService.on(
    EventTypes.PAYMENT_FAILED,
    async ({ payment, order, userId }) => {
      await NotificationService.create({
        userId,
        type: "PAYMENT_FAILED",
        title: "Payment unsuccessful",
        message: `Your payment for order ${order.orderNumber} could not be completed.`,
        actionUrl: `/orders/${order.id}`,
        metadata: { orderId: order.id, paymentId: payment.id },
      });
    },
  );

  EventService.on(EventTypes.ORDER_SHIPPED, async ({ order, userId }) => {
    await NotificationService.create({
      userId,
      type: "ORDER_SHIPPED",
      title: "Your order has shipped",
      message: `Your order ${order.orderNumber} is on its way.`,
      actionUrl: `/orders/${order.id}`,
      metadata: { orderId: order.id },
    });
  });

  EventService.on(EventTypes.ORDER_DELIVERED, async ({ order, userId }) => {
    await NotificationService.create({
      userId,
      type: "ORDER_DELIVERED",
      title: "Your order was delivered",
      message: `Your order ${order.orderNumber} has been delivered.`,
      actionUrl: `/orders/${order.id}`,
      metadata: { orderId: order.id },
    });
  });

  EventService.on(EventTypes.VENDOR_VERIFIED, async ({ vendor, userId }) => {
    await NotificationService.create({
      userId: userId ?? vendor.userId,
      type: "VENDOR_VERIFIED",
      title: "Vendor account verified",
      message: "Your vendor account has been verified.",
      actionUrl: "/vendor/dashboard",
      metadata: { vendorId: vendor.id },
    });
  });

  EventService.on(
    EventTypes.REVIEW_POSTED,
    async ({ review, product, vendorId }) => {
      const vendor = await VendorRepository.findById(vendorId);

      if (!vendor) return;

      await NotificationService.create({
        userId: vendor.userId,
        type: "REVIEW_POSTED",
        title: "New Review",
        message: `A customer left a review for ${product.name}.`,
        actionUrl: `/vendor/products/${product.id}/reviews`,
        metadata: {
          reviewId: review.id,
          productId: product.id,
        },
      });
    },
  );

  // =========================
  // REVIEW RESPONSE
  // =========================

  EventService.on(
    EventTypes.REVIEW_RESPONSE,
    async ({ review, product, customerId }) => {
      await NotificationService.create({
        userId: customerId,
        type: "REVIEW_RESPONSE",
        title: "Your review received a response",
        message: `The vendor responded to your review for ${product.name}.`,
        actionUrl: `/products/${product.id}`,
        metadata: {
          reviewId: review.id,
          productId: product.id,
        },
      });
    },
  );
}
