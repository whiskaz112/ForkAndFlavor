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
    const files = req.files;
    console.log('Uploaded files:', files);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

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

    let imageIndex = 0;
    const updatedDetails = parsedDetails.map(detail => {
      if (detail.type === 'image' && files[imageIndex]) {
        const file = files[imageIndex];
        imageIndex++;
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

    console.log('Updated details:', updatedDetails);

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
    console.error(error);
    res
      .status(500)
      .json({ message: 'Failed to create post', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { name, ingredient, gastronomy, category, details } = req.body;
    const files = req.files;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const postUserId = post.userId.toString();
    if (userId !== postUserId) {
      return res.status(403).json({ message: 'You cannot update this post.' });
    }

    let parsedDetails;
    try {
      parsedDetails =
        typeof details === 'string' ? JSON.parse(details) : details;
    } catch (error) {
      return res.status(400).json({ message: 'Invalid details format' });
    }

    let imageIndex = 0;
    const updatedDetails = parsedDetails.map(detail => {
      if (detail.type === 'image' && files[imageIndex]) {
        const file = files[imageIndex];
        imageIndex++;
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

    const updatedPost = await postService.updatePost(postId, {
      name,
      ingredient,
      gastronomy,
      category,
      details: updatedDetails,
    });

    res.status(200).json({
      message: 'Post updated successfully',
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Failed to update post',
      error: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.id;

    const result = await postService.deletePost(postId, userId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    if (error.message === 'Post not found') {
      res.status(404).json({ message: error.message });
    } else if (
      error.message === 'You do not have permission to delete this post.'
    ) {
      res.status(403).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: 'Failed to delete post', error: error.message });
    }
  }
};
