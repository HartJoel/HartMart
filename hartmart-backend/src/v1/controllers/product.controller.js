import ProductService from "../../services/product.service.js";

const createProduct = async (req, res) => {
  try {
    const product = await ProductService.createProduct(req.user.id, req.body);

    return res.status(201).json({
      success: "true",
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();

    return res.status(201).json({
      success: "true",
      message: "Products list",
      data: products,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const vendorProducts = await ProductService.getVendorProduct(req.user.id);

    return res.status(201).json({
      success: "true",
      message: "Vendor Products list",
      data: vendorProducts,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const updateStock = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getLowStock = async (req, res) => {
  try {
    const data = await ProductService.getLowStockProducts(req.user.id);

    return res.status(201).json({
      success: "true",
      message: "Low Stocks",
      data: data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await ProductService.getProductById(req.params.productId);
    return res.status(201).json({
      success: "true",
      message: "Product",
      data: product,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await ProductService.deleteProduct(productId, userId);

    return res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

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
