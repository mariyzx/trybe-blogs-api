const userService = require('../services/user.service');
const authService = require('../services/auth.service');

const createUser = async (req, res) => {
  const { error, token } = await userService.createUser(req.body);
  const tk = token;
  if (error === 'User already registered') return res.status(409).json({ message: error });
  if (error) return res.status(400).json({ message: error });

  return res.status(201).json({ token: tk });
};

const getAllUsers = async (req, res) => {
  const { authorization } = req.headers;
  const { error, user } = await authService.validateToken(authorization);

  if (error) return res.status(401).json({ message: 'Token not found' });
  if (user.error) return res.status(401).json({ message: 'Expired or invalid token' });

  const users = await userService.getAllUsers();

  return res.status(200).json(users);
};

module.exports = { createUser, getAllUsers };