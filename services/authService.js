const User = require('../models/User');
const Follow = require('../models/Follow');
const UserPostInteraction = require('../models/UserPostInteraction');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const secret = 'forkandflavoreiei'; // secret key for create token

exports.registerUser = async (username, email, password) => {
  const user = await User.findOne({ username });
  if (user) throw new Error('This username is already used.'); // Throw an error to be caught by the caller

  const newUser = new User({ username, email, password, role: 'user' }); // automatically set to 'user'
  await newUser.save();

  // make follow and post interaction table for new user
  const follow = new Follow({ userId: newUser, following: [], follower: [] });
  await follow.save();
  const userInteraction = new UserPostInteraction({ userId: newUser, myPost: [], bookmarkPost: [] });
  await userInteraction.save()

  newUser.follows = follow._id;
  newUser.posts = userInteraction._id;
  await newUser.save();

  return newUser;
};

exports.loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid email'); // user doesn't existed

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password'); // password not match

  const payload = { id: user._id, username: user.username, role: user.role }; // add username to see who
  const token = jwt.sign(payload, secret, { expiresIn: '1h' });
  if (!token) throw new Error('token error');

  return token;
};
