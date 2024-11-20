const mongoose = require('mongoose');

const detailSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['instruction', 'content', 'image'],
      required: true,
    },
    context: {
      type: String,
      required: function () {
        return this.type === 'instruction' || this.type === 'content';
      },
    },
    images: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      required: function () {
        return this.type === 'image';
      },
    },
  },
  { timestamps: true }
);

const Detail = mongoose.model('Detail', detailSchema);

module.exports = Detail;
