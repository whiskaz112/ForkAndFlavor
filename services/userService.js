const User = require('../models/User');

exports.getCurrentUserId = async (req, res) => {
  try {
    const user = await User.findOne({ username: 'bruce_wayne' }).exec();
    if (!user) {
      throw new Error('User not found');
    }
    return user._id;
  } catch (error) {
    console.error(error);
  }
};
