const mongoose = require('mongoose');

const postSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    ingredient: {
      type: String,
      required: true,
      trim: true,
    },
    gastronomy: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    userId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true,
      },
    ],
    details: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Detail',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);
