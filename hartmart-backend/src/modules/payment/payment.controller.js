import asyncHandler from "../../shared/utils/asyncHandler.js";
import PaymentService from "./payment.service.js";

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

export { initializePayment };
