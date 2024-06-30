const Comment = require('../models/Comment');
const User = require('../models/User');
const Post = require('../models/Post');

exports.addComment = async (req, res) => {
  const { message, parentId } = req.body;
  const userId = req.cookies.userId;
  const postId = req.params.id;

  if (!message || message.trim() === '') {
    return res.send('Message is required');
  }

  try {
    const comment = new Comment({
      message,
      userId,
      parentId,
      postId,
    });

    await comment.save();

    const post = await Post.findById(postId);

    post.comments.splice(0, 0, comment._id);

    await post.save();

    const populatedComment = await Comment.findById(comment._id).populate({
      path: 'userId',
      select: 'username _id',
    });

    res.status(201).send({
      ...populatedComment.toObject(),
      likeCount: 0,
      likedByMe: false,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { message } = req.body;
    const comment = await Comment.findById(req.params.commentId).select(
      'userId'
    );

    if (!message || message.trim() === '') {
      return res.send('Message is required');
    }

    if (comment.userId.toString() !== req.cookies.userId) {
      return res
        .status(401)
        .send('You do not have permission to edit this message');
    }

    comment.message = message;
    await comment.save();

    res.send({ message: comment.message });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId).select(
      'userId parentId'
    );

    if (comment.userId.toString() !== req.cookies.userId) {
      return res
        .status(401)
        .send('You do not have permission to delete this message');
    }

    const deleteChildComments = async parentId => {
      const childComments = await Comment.find({ parentId });
      for (const children of childComments) {
        await deleteChildComments(children._id);
        await Comment.findByIdAndDelete(children._id);
      }
    };

    await deleteChildComments(comment._id);

    await Comment.findByIdAndDelete(req.params.commentId);

    res.send({ id: req.params.commentId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
