import CartService from "../../services/cart.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const addToCart = asyncHandler(async (req, res) => {
  const item = await CartService.addToCart(req.user.id, req.body);
  res.status(201).json({
    success: "true",
    message: "Add product to shopping cart",
    data: item,
  });
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await CartService.getCart(req.user.id);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

const updateItem = asyncHandler(async (req, res) => {
  const data = await CartService.updateCartItem(
    req.params.cartItemId,
    req.body.quantity,
  );

  return res.status(200).json({
    success: true,
    data,
  });
});

const removeFromCart = asyncHandler(async (req, res) => {
  await CartService.removeFromCart(req.params.cartItemId);

  return res.status(204).send();
});

const clearCart = asyncHandler(async (req, res) => {
  await CartService.clearCart(req.user.id);

  return res.status(204).send();
});

export { addToCart, getCart, updateItem, removeFromCart, clearCart };
