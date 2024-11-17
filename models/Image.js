const mongoose = require('mongoose');

const imageSchema = mongoose.Schema(
  {
    filePath: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
