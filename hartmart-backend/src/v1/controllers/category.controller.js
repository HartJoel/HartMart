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

const getCategories = async (req, res) => {
  try {
    const categories = await CategoryService.list();

    res.status(201).json({
      success: "true",
      data: categories,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const getCategory = async (req, res) => {
  try {
    const data = await CategoryService.getCategory(req.params.categoryId);

    res.status(200).json({
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

const updateCategory = async (req, res) => {
  try {
    const data = await CategoryService.update(req.params.categoryId, req.body);

    res.status(200).json({
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

const deleteCategory = async (req, res) => {
  try {
    await CategoryService.delete(req.params.categoryId);

    res.status(204).send();
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
