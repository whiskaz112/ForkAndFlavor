const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (username, email, password, role) => {
  const user = new User({ username, email, password, role });
  await user.save();
  return user;
};

exports.loginUser = async (username, password) => {
  const user = await User.findOne({ username });
  // console.log(user);
  if (!user) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { id: user._id, role: user.role },
    'forkandflavoreiei',
    { expiresIn: '1h' }
  );

  return token;
};
