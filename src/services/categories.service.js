const Joi = require('joi');
const { Category } = require('../models');

const createCategory = async (name) => {
  const schemaName = Joi.string().min(1).required();

  const { error } = schemaName.validate(name);
  if (error) return { error: '"name" is required' };
  await Category.create({ name });

  const { dataValues } = await Category.findOne({ where: { name } });

  return { dataValues };
};

module.exports = { createCategory };