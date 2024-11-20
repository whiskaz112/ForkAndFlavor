const Post = require('../models/Post');
const Detail = require('../models/Detail');
const Image = require('../models/Image');
const UserPostInteraction = require('../models/UserPostInteraction');

exports.createPost = async postData => {
  const { name, ingredient, gastronomy, category, userId, details } = postData;
  
  //   console.log('Details:', details);
  
  const parsedDetails =
  typeof details === 'string' ? JSON.parse(details) : details;
  
  if (!Array.isArray(parsedDetails)) {
    throw new Error('Details must be an array');
  }
  
  //   console.log('Parsed Details:', parsedDetails);
  
  const savedDetails = await Promise.all(
    details.map(async detail => {
      if (detail.type === 'image') {
        const image = await Image.create({
          filePath: detail.images.filePath,
          mimeType: detail.images.mimeType,
          size: detail.images.size,
        });
        return Detail.create({ type: detail.type, images: image._id });
      } else {
        return Detail.create({ type: detail.type, context: detail.context });
      }
    })
  );
  
  const newPost = await Post.create({
    name,
    ingredient,
    gastronomy,
    category,
    userId,
    details: savedDetails.map(detail => detail._id),
  });

  const upi = await UserPostInteraction.findOne({ userId });
  if (!upi) throw new Error("User not found or User can't posted.");
  upi.myPost.push(newPost);
  await upi.save();

  return newPost;
};
