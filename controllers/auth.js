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
  const { email, password } = req.body;
  try {
    const token = await authService.loginUser(email, password);

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

exports.getUser = async (req, res) => {
  try {
    console.log('start using token');
    const authToken = req.cookies.token;
    console.log('token', authToken);
    const verifyUser = jwt.verify(authToken, secret);
    const checkUser = await User.findOne({ email: verifyUser.user.email });
    if (!checkUser) {
      throw { message: 'user not found' };
    }
    console.log('this checkUser: ', checkUser);
    res.status(200).json(checkUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server Error',
      err,
    });
  }
};

exports.uploadPic = async (req, res) => {
  res.json(req.file);
};
