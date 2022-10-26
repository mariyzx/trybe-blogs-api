const userService = require('../services/user.service');

const createUser = async (req, res) => {
  const { error, token } = await userService.createUser(req.body);
  const tk = token;
  if (error === 'User already registered') return res.status(409).json({ message: error });
  if (error) return res.status(400).json({ message: error });

  return res.status(201).json({ token: tk });
};

module.exports = { createUser };