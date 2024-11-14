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
    const { commentId, postId } = req.params;

    const comment = await Comment.findById(commentId).select('userId rate');

    if (!comment) {
      return res.status(404).send('Comment not found');
    }

    if (comment.userId.toString() !== req.cookies.userId) {
      return res
        .status(401)
        .send('You do not have permission to delete this comment');
    }

    const deleteChildComments = async parentId => {
      const childComments = await Comment.find({ parentId });
      for (const child of childComments) {
        await deleteChildComments(child._id);
        await Comment.findByIdAndDelete(child._id);
        await Post.findByIdAndUpdate(postId, {
          $pull: { comments: child._id },
        });
      }
    };

    await deleteChildComments(comment._id);
    await Comment.findByIdAndDelete(commentId);

    const post = await Post.findById(postId);

    post.comments.pull(commentId);

    const remainingComments = await Comment.find({
      _id: { $in: post.comments },
    });
    const totalRatings = remainingComments.length;
    const totalRatingSum = remainingComments.reduce(
      (sum, cmt) => sum + cmt.rate,
      0
    );
    const averageRating =
      totalRatings === 0 ? 0 : totalRatingSum / totalRatings;

    post.totalRatings = totalRatings;
    post.averageRating = averageRating;

    await post.save();

    res.send({ id: commentId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
};
// exports.deleteComment = async (req, res) => {
//   try {
//     const comment = await Comment.findById(req.params.commentId).select(
//       'userId parentId'
//     );

//     if (comment.userId.toString() !== req.cookies.userId) {
//       return res
//         .status(401)
//         .send('You do not have permission to delete this message');
//     }

//     const deleteChildComments = async parentId => {
//       const childComments = await Comment.find({ parentId });
//       for (const child of childComments) {
//         await deleteChildComments(child._id);
//         await Comment.findByIdAndDelete(child._id);
//         await Post.findByIdAndUpdate(req.params.postId, {
//           $pull: { comments: child._id },
//         });
//       }
//     };

//     await deleteChildComments(comment._id);
//     await Comment.findByIdAndDelete(req.params.commentId);

//     await Post.findByIdAndUpdate(req.params.postId, {
//       $pull: { comments: req.params.commentId },
//     });

//     res.send({ id: req.params.commentId });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server error');
//   }
// };
