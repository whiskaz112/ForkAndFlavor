const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    await authService.registerUser(username, email, password, role);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const token = await authService.loginUser(username, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
      sameSite: 'strict',
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
