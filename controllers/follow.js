const Follow = require('../models/Follow');
const User = require('../models/User');

exports.followFunc = async (req, res) => {
    try {
        const myUser = req.params.id;
        const targetId = req.body.userId;

        //Check user and target user is on User model.
        const user = await User.findById(myUser);
        const targetUser = await User.findById(targetId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (!targetUser) {
            return res.status(404).send('Target user not found');
        }

        // Find the user who wants to follow someone
        let userFollowData = await Follow.findOne({ userId: myUser });
        // if (!userFollowData) {
        //   userFollowData = new Follow({ userId: myUser, following: [], follower: [] });
        // }

        // Find the target user
        let targetFollowData = await Follow.findOne({ userId: targetId });
        // if (!targetFollowData) {
        //   targetFollowData = new Follow({ userId: targetId, following: [], follower: [] });
        // }

        // Add targetId to user's following list
        if (!userFollowData.following.includes(targetId)) {
            userFollowData.following.push(targetId);
            await userFollowData.save();
        }
        else {
            return res.status(200).send('Follow already');
        }

        // Add myUser to target user's followers list
        if (!targetFollowData.follower.includes(myUser)) {
            targetFollowData.follower.push(myUser);
            await targetFollowData.save();
        }
        else {
            return res.status(200).send('Follow already');
        }

        res.status(200).send('Followed successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.unfollowFunc = async (req, res) => {
    try {
        const myUser = req.params.id;
        const targetId = req.body.userId;

        // Find the user who wants to unfollow someone
        const userFollowData = await Follow.findOne({ userId: myUser });
        if (userFollowData) {
            userFollowData.following.pull(targetId);
            await userFollowData.save();
        }

        // Find the target user
        const targetFollowData = await Follow.findOne({ userId: targetId });
        if (targetFollowData) {
            targetFollowData.follower.pull(myUser);
            await targetFollowData.save();
        }

        res.status(200).send('Unfollowed successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};


exports.followList = async (req, res) => {
    try {
        const myUser = await req.params.id;
        const userFollowData = await Follow.findOne({ userId: myUser });
        if (!userFollowData) {
            return res.status(404).send('User not found');
        }
        res.status(202).json(userFollowData);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

// to fix bug on db
exports.deleteFollow = async (req, res) => {
    try {
        const myUser = await req.params.id;
        const targetId = await req.params.delId;
        const user = await Follow.findOne({ userId: myUser })
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.following.pop(targetId);
        await user.save();

        res.status(200).send()
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
}