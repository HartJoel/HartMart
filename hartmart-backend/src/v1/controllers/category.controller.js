import CategoryService from "../../services/category.service.js";

const createCategory = async (req, res) => {
  try {
    const category = await CategoryService.createCategory(req.body);

    res.status(201).json({
      success: "true",
      data: category,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export default createCategory;
