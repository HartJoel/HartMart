import ProductService from "../../services/product.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createProduct = asyncHandler(async (req, res) => {
  const product = await ProductService.createProduct(
    req.user.id,
    req.body,
    req.file,
  );

  return res.status(201).json({
    success: "true",
    message: "Product created successfully",
    data: product,
  });
});

const getAllProducts = asyncHandler(async (req, res) => {
  const products = await ProductService.getAllProducts(req.query);
  return res.status(201).json({
    success: true,
    message: "Get all Products",
    data: products,
    pagination: products.pagination,
  });
});

const getVendorProducts = asyncHandler(async (req, res) => {
  const vendorProducts = await ProductService.getVendorProduct(
    req.user.id,
    req.query,
  );

  return res.status(201).json({
    success: "true",
    message: "Vendor Products list",
    data: vendorProducts,
  });
});

const updateStock = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const data = await ProductService.updateStock(
    productId,
    req.user.id,
    req.body,
  );

  return res.status(201).json({
    success: "true",
    message: "Updated Stock",
    data: data,
  });
});

const getLowStock = asyncHandler(async (req, res) => {
  const data = await ProductService.getLowStockProducts(req.user.id, req.query);

  return res.status(201).json({
    success: "true",
    message: "Low Stocks",
    data: data,
  });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await ProductService.getProductById(req.params.productId);
  return res.status(201).json({
    success: "true",
    message: "Product",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const {
    name,
    description,
    basePrice,
    discountPrice,
    totalStock,
    availableStock,
    reservedStock,
    reorderLevel,
    images,
    weight,
    dimensions,
    attributes,
    categoryId,
    categorySlug,
    slug,
  } = req.body;

  const updatedProduct = await ProductService.updateProduct(id, userId, {
    name,
    description,
    basePrice,
    discountPrice,
    totalStock,
    availableStock,
    reservedStock,
    reorderLevel,
    images,
    weight,
    dimensions,
    attributes,
    categoryId,
    categorySlug,
    slug,
  });

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  await ProductService.deleteProduct(productId, userId);

  return res.status(204).send();
});

export {
  createProduct,
  getAllProducts,
  getVendorProducts,
  updateStock,
  getLowStock,
  getProductById,
  updateProduct,
  deleteProduct,
};
