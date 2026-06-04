import OrderService from "../../services/order.service.js";

const createOrder = async (req, res) => {
  try {
    const order = await OrderService.createOrder(req.user.id, req.body);

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getTimeline = async (req, res) => {
  try {
    const timeline = await OrderService.getOrderTimeline(req.params.orderId);

    return res.status(200).json({
      success: true,
      data: timeline,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const order = await OrderService.getOrder(req.params.orderId);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await OrderService.getUserOrders(req.user.id);

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export { createOrder, getTimeline, getOrder, getUserOrders };
