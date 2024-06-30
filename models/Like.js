const mongoose = require('mongoose');

const likeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
      required: true,
    },
  },
  { timestamps: true }
);

// Create the Comment model
const Like = mongoose.model('Like', likeSchema);

module.exports = Comment;
