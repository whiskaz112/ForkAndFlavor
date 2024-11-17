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
// const User = require('../models/User');
// const Follow = require('../models/Follow');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { token } = require('morgan');
// const multer = require('multer');
// const UserPostInteraction = require('../models/UserPostInteraction');

// let secret = 'jwtsecret';

// exports.register = async (req, res) => {
//     try {
//         const { username, password, email } = req.body;

//         let user = await User.findOne({ username });
//         if (user) {
//             return res.status(400).send('This username is already used.');
//         }

//         const salt = await bcrypt.genSalt(10);
//         user = new User({
//             username,
//             password,
//             email,
//         });
//         user.password = await bcrypt.hash(password, salt);
//         await user.save();

//         const objectId = await User.findOne({ username });
//         let follow = new Follow({ userId: objectId, following: [], follower: [] });
//         await follow.save();
//         let userInteraction = new UserPostInteraction({ userId: objectId, myPost: [], bookmarkPost: [] });
//         await userInteraction.save()

//         res.status(200).json({ success: true, message: 'Registered :D' });
//     } catch (err) {
//         console.log(err);
//         res.status(500).send('Server Error');
//     }
// };

// exports.login = async (req, res) => {
//     try {
//         //code
//         // 1. Check User
//         const { email, password } = req.body;
//         let user = await User.findOneAndUpdate({ email }, { new: true });
//         console.log(user);
//         if (user) {
//             const isMatch = await bcrypt.compare(password, user.password);

//             if (!isMatch) {
//                 return res.status(400).send('Password Invalid!');
//             }
//             // 2. Payload
//             let payload = {
//                 user: {
//                     username: user.username,
//                     email: user.email
//                 },
//             };
//             // 3. Generate
//             const token = jwt.sign(payload, secret, { expiresIn: 3600 });
//             if (!token) {
//                 throw {message: 'token error'};
//             };
//             res.cookie('token', token, {
//                 maxAge: 300000,
//                 secure: true,
//                 httpOnly: true,
//                 sameSite: "none",
//             });
//             res.json({ payload , success: true});
//         } else {
//             return res.status(400).send('User not found!');
//         }
//     } catch (err) {
//         //code
//         console.log(err);
//         res.status(500).send('Server Error');
//     }
};

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
};