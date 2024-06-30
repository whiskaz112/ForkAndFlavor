const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    rate: {
      type: Number,
      min: 1,
      max: 5,
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
      },
    ],
    postId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        require: true,
      },
    ],
    parentId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    children: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like',
      },
    ],
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
