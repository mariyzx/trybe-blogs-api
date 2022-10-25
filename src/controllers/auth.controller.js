const authService = require('../services/auth.service');

const login = async (req, res) => {
  const { error, email, password } = authService.validateBody(req.body);
  if (error) {
    return res.status(400).json({ message: error });
  }

  const { token, e } = await authService.validateLogin({ email, password });

  if (e) {
    return res.status(400).json({ message: e });
  }

  res.status(200).json({ token });
};

module.exports = { login };