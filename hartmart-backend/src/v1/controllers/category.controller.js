import CategoryService from "../../services/category.service.js";
import asyncHandler from "../../utils/asyncHandler.js";

const createCategory = asyncHandler(async (req, res) => {
  const category = await CategoryService.createCategory(req.body);

  res.status(201).json({
    success: "true",
    data: category,
  });
});

const getCategories = asyncHandler(async (req, res) => {
  const categories = await CategoryService.list();

  res.status(201).json({
    success: "true",
    data: categories,
  });
});

const getCategory = asyncHandler(async (req, res) => {
  const data = await CategoryService.getCategory(req.params.categoryId);

  res.status(200).json({
    success: true,
    data,
  });
});

const updateCategory = asyncHandler(async (req, res) => {
  const data = await CategoryService.update(req.params.categoryId, req.body);

  res.status(200).json({
    success: true,
    data,
  });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await CategoryService.delete(req.params.categoryId);

  res.status(204).send();
});

export {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
