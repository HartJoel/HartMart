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
  }


export default createProduct;
