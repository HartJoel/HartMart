import OrderRespository from "../repositories/order.respository.js";
import { nanoid } from "nanoid";
import AppError from "../utils/AppError.js";
import VendorRepository from "../repositories/vendor.responsitory.js";
import NotificationService from "./notification.service.js";

class OrderService {
  static async createOrder(userId, payload) {
    const cartItems = await OrderRespository.getCart(userId);

    if (!cartItems.length) {
      throw new AppError("Cart is empty", 404);
    }

    const address = await OrderRespository.getDefaultAddress(userId);

    if (!address) {
      throw new AppError("No default address found", 404);
    }

    let subtotal = 0;

    const orderItems = cartItems.map((item) => {
      const price = Number(
        item.product.discountPrice || item.product.basePrice || 0,
      );
      const qty = Number(item.quantity || 0);

      const totalPrice = price * qty;
      subtotal += totalPrice;

      return {
        productId: item.productId,
        vendorId: item.product.vendorId,
        quantity: qty,
        unitPrice: price.toString(),
        totalPrice: totalPrice.toString(),
        selectedVariation: item.selectedVariation,
      };
    });

    const taxAmount = subtotal * 0.05;
    const shippingCost = 10;
    let discountAmount = 0;

    const totalAmount = subtotal + taxAmount + shippingCost - discountAmount;

    // CREATE ORDER
    const order = await OrderRespository.create({
      orderNumber: nanoid(10),
      customerId: userId,
      subtotal: subtotal.toString(),
      taxAmount: taxAmount.toString(),
      shippingCost: shippingCost.toString(),
      discountAmount: discountAmount.toString(),
      totalAmount: totalAmount.toString(),
      shippingAddress: JSON.stringify(address),
      customerNotes: payload.customerNotes,
      status: "PENDING",
    });

    await OrderRespository.createOrderItems(
      orderItems.map((item) => ({
        ...item,
        orderId: order.id,
      })),
    );

    await OrderRespository.addTimeline({
      orderId: order.id,
      status: "PENDING",
      note: "Order created",
    });

    await OrderRespository.clearCart(userId);

    // 1. Notify CUSTOMER
    await NotificationService.create({
      userId,
      type: "ORDER_CREATED",
      title: "Order placed successfully",
      message: `Your order ${order.orderNumber} has been placed.`,
      actionUrl: `/orders/${order.id}`,
      metadata: {
        orderId: order.id,
      },
    });

    const vendorIds = new Set();

    for (const item of orderItems) {
      if (item.vendorId) {
        vendorIds.add(item.vendorId);
      }
    }

    console.log("ORDER ITEMS:", cartItems);

    // 2. Notify VENDORS
    for (const item of orderItems) {
      const vendor = await VendorRepository.findById(item.vendorId);

      console.log("VENDOR LOOKUP:", vendor);

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

    return order;
  }

  static async getOrderTimeline(orderId) {
    return await OrderRespository.getTimeline(orderId);
  }

  static async getOrder(orderId) {
    return await OrderRespository.findById(orderId);
  }

  static async getUserOrders(userId) {
    return await OrderRespository.findByCustomer(userId);
  }

  static async getVendorOrders(userId) {
    const vendor = await VendorRepository.findUserId(userId);

    return await OrderRespository.getVendorOrders(vendor.id);
  }

  static async updateOrderStatus(orderId, status) {
    return OrderRespository.updateStatus(orderId, status);
  }
}

export default OrderService;
