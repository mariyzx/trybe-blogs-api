const categoryService = require('../services/categories.service');

const createCategory = async (req, res) => {
  const { name } = req.body;
  const { error, dataValues } = await categoryService.createCategory(name);

  if (error) return res.status(400).json({ message: error });
  return res.status(201).json(dataValues);
};

const getAllCategories = async (_req, res) => {
  const categories = await categoryService.getAllCategories();
  return res.status(200).json(categories);
};

module.exports = { createCategory, getAllCategories };