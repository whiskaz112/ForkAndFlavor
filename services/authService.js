const User = require('../models/User');
const Follow = require('../models/Follow');
const UserPostInteraction = require('../models/UserPostInteraction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = 'forkandflavoreiei';

exports.registerUser = async (username, email, password) => {
  const user = await User.findOne({ username });
  if (user) throw new Error('This username is already used.');

  const newUser = new User({ username, email, password, role: 'user' });
  await newUser.save();

  const follow = new Follow({ userId: newUser, following: [], follower: [] });
  await follow.save();
  const userInteraction = new UserPostInteraction({
    userId: newUser,
    myPost: [],
    bookmarkPost: [],
  });
  await userInteraction.save();

  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');

  const payload = { id: user._id, username: user.username, role: user.role };
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  if (!token) throw new Error('token error');

  return token;
};
