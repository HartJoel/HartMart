import OrderService from "../../services/order.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createOrder = asyncHandler(async (req, res) => {
  const order = await OrderService.createOrder(req.user.id, req.body);

  return res.status(201).json({
    success: true,
    data: order,
  });
});

const getTimeline = asyncHandler(async (req, res) => {
  const timeline = await OrderService.getOrderTimeline(req.params.orderId);

  return res.status(200).json({
    success: true,
    data: timeline,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await OrderService.getOrder(req.params.orderId);

  return res.status(200).json({
    success: true,
    data: order,
  });
});

const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await OrderService.getUserOrders(req.user.id);

  return res.status(200).json({
    success: true,
    data: orders,
  });
});

export { createOrder, getTimeline, getOrder, getUserOrders };
