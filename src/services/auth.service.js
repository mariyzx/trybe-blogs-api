const Joi = require('joi');
const jwtUtil = require('../utils/jwt.util');

const { User } = require('../models');

// precisamos validar o body do login

const validateBody = (params) => {
  // valida os dados
  const schema = Joi.object({
    email: Joi.string().email().required(),
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

module.exports = { validateBody, validateLogin };