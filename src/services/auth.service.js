const Joi = require('joi');
const jwtUtil = require('../utils/jwt.util');

const { User } = require('../models');

// precisamos validar o body do login

const validateBody = (params) => {
  // valida os dados
  const schema = Joi.object({
    email: Joi.string().email().min(8).required(),
    password: Joi.string().required(),
  });

  const { error, value } = schema.validate(params);

  if (error) {
    const e = 'Some required fields are missing';
    return { error: e };
  }

  return value;
};

const validateLogin = async ({ email, password }) => {
  // valida a existencia no banco; SELECT * FROM USERS WHERE EMAIL : XXXX
  const user = await User.findOne({ where: { email } });

  if (!user || user.password !== password) {
    const e = 'Invalid fields';
    return { e };
  }

  const { password: _, ...userWithoutPassword } = user.dataValues;

  const token = jwtUtil.createToken(userWithoutPassword);

  return { token };
};

const validateUser = async (user) => {
  const { email } = user;
  // validar os inputs;
  const schema = Joi.object({
    displayName: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  const { error } = schema.validate(user);
  if (error) return { error: error.message };

  // validar se o usuário já nao existe
  const userExist = await User.findOne({ where: { email } });
  if (userExist) return { error: 'User already registered' };

  const token = jwtUtil.createToken(user);

  return { token };
};

const validateToken = async (token) => {
  if (!token) {
    return { error: 'Token obrigatório!' };
  }

  const user = await jwtUtil.validateToken(token);  

  return { user };
};

const validatePost = async (post) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
    categoryIds: Joi.array().items(Joi.number()).required(),
  });

  const { error } = schema.validate(post);

  if (error) return error;

  return null;
};

const validatePostById = async (post) => {
  const schema = Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().min(1).required(),
  });

  const { error } = schema.validate(post);

  if (error) return error;

  return null;
};

module.exports = { 
  validateBody,
  validateLogin,
  validateUser,
  validateToken,
  validatePost,
  validatePostById, 
};