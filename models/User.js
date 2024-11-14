const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profilePic: {
      type: Buffer
    },
    profilePicType: {
      type: String, // To store the MIME type of the image (optional)
    }
  },
  { timestamps: true }
);

userSchema.virtual('profilePicPath').get(function() {
  if (this.profilePic != null && this.profilePicType != null) {
    return `data:${this.profilePicType};base64,${this.profilePic.toString('base64')}`;
  }
});

module.exports = mongoose.model('User', userSchema);
