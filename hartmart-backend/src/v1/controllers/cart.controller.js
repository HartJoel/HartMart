import CartService from "../../services/cart.service.js";

const addToCart = async (req, res) => {
  try {
    const item = await CartService.addToCart(req.user.id, req.body);
    res.status(201).json({
      success: "true",
      message: "Add product to shopping cart",
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await CartService.getCart(req.user.id);

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const updateItem = async (req, res) => {
  try {
    const data = await CartService.updateCartItem(
      req.params.cartItemId,
      req.body.quantity,
    );

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    await CartService.removeFromCart(req.params.cartItemId);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    await CartService.clearCart(req.user.id);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { addToCart, getCart, updateItem, removeFromCart, clearCart };
