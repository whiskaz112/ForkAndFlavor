const authService = require('../services/authService');

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    await authService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully', success: true });
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
      maxAge: 60 * 60 * 1000, // 1hour
      sameSite: 'strict',
    });

    res.json({ message: 'Login successful', success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.cookie('token', '', { maxAge: 1 });
    res.json({ message: 'Logout successful', success: true });
  }
  catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// not used
exports.getUser = async (req, res) => {
  try {
    console.log('start using token');
    const authToken = req.cookies.token;
    console.log('token', authToken)
    const verifyUser = jwt.verify(authToken, secret);
    const checkUser = await User.findOne({ email: verifyUser.user.email });
    if (!checkUser) {
      throw { message: 'user not found' };
    }
    console.log('this checkUser: ', checkUser)
    res.status(200).json(checkUser);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Server Error',
      err
    });
  }
};

exports.uploadPic = async (req, res) => {
  res.json(req.file)
  // try {
  //     const formData = req.body;
  //     const userId = formData.userId;
  //     const image = req.file;

  //     console.log('formData: ', formData)
  //     console.log('userId: ', userId)
  //     console.log('image: ', image)

  //     const user = await User.findById(userId);
  //     if (!user) {
  //         return res.status(404).json({ message: 'User not found' });
  //     }

  //     user.profilePic = image.buffer; // Assuming you want to save the image buffer
  //     await user.save();
  //     res.status(201).json({ message: 'New image uploaded!!'});
  // }
  // catch (err) {
  //     console.log(err);
  //     res.status(500).json({
  //         message: 'Server Error',
  //         err
  //     })
  // }
};