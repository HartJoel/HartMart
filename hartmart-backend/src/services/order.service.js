import OrderRespository from "../repositories/order.respository.js";
import { nanoid } from "nanoid";

class OrderService {
  static async createOrder(userId, payload) {
    const cartItems = await OrderRespository.getCart(userId);

    if (!cartItems.length) {
      throw new Error("Cart is empty");
    }

    const address = await OrderRespository.getDefaultAddress(userId);

    if (!address) {
      throw new Error("No default address found");
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
}

export default OrderService;
