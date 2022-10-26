const authService = require('../services/auth.service');

const validateAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  const { error, user } = await authService.validateToken(authorization);

  if (error) return res.status(401).json({ message: 'Token not found' });
  if (user.error) return res.status(401).json({ message: 'Expired or invalid token' });

  next();
};

module.exports = { validateAuth };