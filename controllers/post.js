const Post = require('../models/Post');
const postService = require('../services/postService');

exports.read = async (req, res) => {
	try {
		const id = req.params.id;
		const posted = await Post.findOne({ _id: id })
			.populate({
				path: 'comments',
				populate: {
					path: 'userId',
					select: 'username _id',
				},
			})
			.exec();
		res.send(posted);
	} catch (err) {
		console.log(err);
		res.status(500).send('Server Error');
	}
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: 'details',
        populate: {
          path: 'images',
          model: 'Image',
        },
      })
      .populate('comments')
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.createPost = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, ingredient, gastronomy, category, details } = req.body;
    console.log(userId);
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // console.log('Raw details:', details);

    let parsedDetails;
    try {
      parsedDetails =
        typeof details === 'string' ? JSON.parse(details) : details;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid details format' });
    }

    if (!Array.isArray(parsedDetails)) {
      return res.status(400).json({ message: 'Details must be an array' });
    }

    // console.log('Parsed details:', parsedDetails);

    const updatedDetails = parsedDetails.map(detail => {
      if (detail.type === 'image') {
        return {
          ...detail,
          images: {
            filePath: file.path,
            mimeType: file.mimetype,
            size: file.size,
          },
        };
      }
      return detail;
    });

    const postData = {
      name,
      ingredient,
      gastronomy,
      category,
      userId,
      details: updatedDetails,
    };

    const newPost = await postService.createPost(postData);

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create post',
      error: error.message,
    });
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
