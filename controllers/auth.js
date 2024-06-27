const User = require('../models/User');
const Follow = require('../models/Follow');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const UserPostInteraction = require('../models/UserPostInteraction');

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.send('This username is already used.').status(400);
        }

        const salt = await bcrypt.genSalt(10);
        user = new User({
            username,
            password,
            email,
        });
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const objectId = await User.findOne({ username });
        let follow = new Follow({ userId: objectId, following: [], follower: [] });
        await follow.save();
        let userInteraction = new UserPostInteraction({ userId: objectId, myPost: [], bookmarkPost: [] });
        await userInteraction.save()

        res.send('Registered :D');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    try {
        //code
        // 1. Check User
        const { username, password } = req.body;
        let user = await User.findOneAndUpdate({ username }, { new: true });
        console.log(user);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).send('Password Invalid!');
            }
            // 2. Payload
            let payload = {
                user: {
                    username: user.username,
                },
            };
            // 3. Generate
            jwt.sign(payload, 'jwtsecret', { expiresIn: 3600 }, (err, token) => {
                if (err) throw err;
                res.json({ token, payload });
            });
        } else {
            return res.status(400).send('User not found!');
        }
    } catch (err) {
        //code
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.list = async (req, res) => {
    try {
        const user = await User.find({});
        res.status(200).json(user);
    }
    catch {
        console.log(err);
        res.status(500).send('Server Error');
    }
}