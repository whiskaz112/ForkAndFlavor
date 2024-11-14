const Post = require('../models/Post');
const Comment = require('../models/Comment');

exports.ratePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { rate } = req.body;
    const userId = req.cookies.userId;

    const newComment = await Comment.create({
      rate,
      userId,
      postId,
    });

    const post = await Post.findById(postId);

    const totalRatings = post.totalRatings + 1;
    const averageRating =
      (post.averageRating * post.totalRatings + rate) / totalRatings;

    post.averageRating = averageRating;
    post.totalRatings = totalRatings;
    post.comments.push(newComment._id);
    const populatedComment = await Comment.findById(newComment._id).populate({
      path: 'userId',
      select: 'username _id',
    });
    await post.save();

    res.status(201).send({ ...populatedComment.toObject() });
  } catch (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
};

// exports.rateWithComment = async (req, res) => {
//   try {
//     //ควยควยควยควย
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Server Error');
//   }
// };

// exports.rate = async (req, res) => {
//   try {
//     const { postId } = req.params;
//     const { userId, message, rate } = req.body;

//     if (!rate || rate < 1 || rate > 5) {
//       return res.status(400).send('Invalid rating value');
//     }

//     const newComment = await Comment.create({
//       message,
//       rate,
//       userId,
//       postId,
//     });

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).send('Post not found');
//     }

//     const totalRatings = post.totalRatings + 1;
//     const averageRating =
//       (post.averageRating * post.totalRatings + rate) / totalRatings;

//     post.averageRating = averageRating;
//     post.totalRatings = totalRatings;

//     await post.save();

//     res.status(201).send(newComment);
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Server Error');
//   }
// };
