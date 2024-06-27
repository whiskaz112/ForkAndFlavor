const Post = require('../models/Post');
const UserPostInteraction = require('../models/UserPostInteraction');

exports.read = async (req, res) => {
	try {
		const id = req.params.id;
		const posted = await Post.findOne({ _id: id }).populate('comments');
		res.send(posted);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

exports.list = async (req, res) => {
	try {
		const posted = await Post.find({}).populate('comments');
		res.status(200).json(posted);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

exports.create = async (req, res) => {
	try {
		const posted = await Post(req.body).save();
		const user = req.params.id;
		const upi = await UserPostInteraction.findOne({ userId: user });
		if (!upi) {
			return res.status(404).send('upi not found');
		}
		upi.myPost.push(posted);
		await upi.save();

		res.send(posted);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

exports.update = async (req, res) => {
	try {
		const id = req.params.id;
		const updated = await Post.findOneAndUpdate({ _id: id }, req.body, {
			new: true,
		}).exec();
		res.send(updated);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

exports.remove = async (req, res) => {
	try {
		const id = req.params.id;
		const removed = await Post.findOneAndDelete({ _id: id }).exec();
		res.send(removed);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};
