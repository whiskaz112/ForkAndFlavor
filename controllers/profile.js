const User = require("../models/User");
const Image = require("../models/Image");

exports.myProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById( userId );
        if (!user) res.status(404).json({ message: 'User not found' });

        res.status(200).json({ 
            user: {
                username: user.username,
                email: user.email,
                password: user.password,
                profilePic: user.profile,
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).send('Server Error');
    }
}

exports.uploadProfilePic = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        const newImage = new Image({
            filePath: file.path,
            mimeType: file.mimetype,
            size: file.size,
        });
        await newImage.save();

        const user = await User.findByIdAndUpdate(req.user.id, {profile: newImage});

        res.status(201).json({
            message: 'File uploaded and saved successfully',
            image: newImage,
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
}