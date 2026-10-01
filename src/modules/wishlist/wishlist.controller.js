import WishlistService from "./wishlist.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

const addToWishList = asyncHandler(async (req, res) => {
  const item = await WishlistService.addToWishList(
    req.user.id,
    req.body.productId,
  );

  res.status(201).json({
    success: true,
    message: "Product added to wishlist successfully.",
    data: item,
  });
});

const getWishlist = asyncHandler(async (req, res) => {
  const list = await WishlistService.getWishlist(req.user.id);

  res.status(200).json({
    success: true,
    message: "Wishlist retrieved successfully.",
    data: list,
  });
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  await WishlistService.deleteFromWishlist(req.user.id, req.params.productId);

  return res.status(204).send();
});

const checkWishlist = asyncHandler(async (req, res) => {
  const result = await WishlistService.checkWishlist(
    req.user.id,
    req.params.productId,
  );

  return res.status(200).json({
    success: true,
    message: "Check if product in wishlist",
    data: result,
  });
});

export { getWishlist, addToWishList, removeFromWishlist, checkWishlist };
