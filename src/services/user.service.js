const { User } = require('../models');
const { validateUser } = require('./auth.service');

const createUser = async (user) => {
  const { displayName, email, password } = user;
  const { error, token } = await validateUser({ displayName, email, password });

  if (error) return { error };

  User.create(user);
  return { token };
};

const getAllUsers = async () => {
  const users = await User.findAll({ attributes: { exclude: ['password'] } });
  return users;
};

const getUserById = async (id) => {
  const [user] = await User.findAll({ where: { id }, attributes: { exclude: ['password'] } });
  return user;
};

module.exports = { createUser, getAllUsers, getUserById };