const UserPostInteraction = require('../models/UserPostInteraction');

exports.bookmark = async (req, res) => {
    try {
        const { userId, postId } = req.params;

        let interaction = await UserPostInteraction.findOne({ userId });
        if (!interaction) {
            return res.status(404).send("user doesn't have interaction");
        }

        if (!interaction.bookmarkPost.includes(postId)) {
            interaction.bookmarkPost.push(postId);
            await interaction.save();
        }

        res.status(200).send('Post bookmarked successfully');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.unbookmark = async (req, res) => {
    try {
        const { userId, postId } = req.params;
        const interaction = await UserPostInteraction.findOne({ userId });
        if (!interaction) {
            return res.status(404).send('Interaction not found');
        }

        if (interaction.bookmarkPost.includes(postId)) {
            interaction.bookmarkPost.pull(postId);
            await interaction.save();
            return res.status(200).send('Post unbookmarked successfully');
        }

        res.status(404).send('not bookmark');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

exports.getBookmark = async (req, res) => {
    try {
        const { userId } = req.params;
        const bookmarks = await UserPostInteraction.findOne({ userId });

        res.status(200).json(bookmarks.bookmarkPost);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};