import WishlistService from "../../services/wishlist.service.js";

const addToWishList = async (req, res) => {
  try {
    const item = await WishlistService.addToWishList(
      req.user.id,
      req.body.productId,
    );

    res.status(201).json({
      success: true,
      message: "Add product to wishlist",
      data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const list = await WishlistService.getWishlist(req.user.id);

    res.status(201).json({
      success: true,
      message: "Get user's wishlist",
      data: list,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await WishlistService.deleteFromWishlist(req.user.id, req.params.productId);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const checkWishlist = async (req, res) => {
  try {
    const result = await WishlistService.checkWishlist(
      req.user.id,
      req.params.productId,
    );

    return res.status(200).json({
      success: true,
      message: "Check if product in wishlist",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export { getWishlist, addToWishList, removeFromWishlist, checkWishlist };
