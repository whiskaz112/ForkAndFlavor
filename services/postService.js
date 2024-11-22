const Post = require('../models/Post');
const Detail = require('../models/Detail');
const Image = require('../models/Image');

exports.createPost = async postData => {
  const { name, ingredient, gastronomy, category, userId, details } = postData;

  const savedDetails = await Promise.all(
    details.map(async detail => {
      if (detail.type === 'image' && detail.images) {
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

  return newPost;
};

exports.updatePost = async (postId, updatedData) => {
  const { name, ingredient, gastronomy, category, details } = updatedData;

  const post = await Post.findById(postId).populate('details');
  if (!post) {
    throw new Error('Post not found');
  }

  const existingDetailIds = post.details.map(detail => detail._id.toString());

  const updatedDetails = await Promise.all(
    details.map(async detail => {
      if (detail._id) {
        const existingDetail = await Detail.findById(detail._id);
        if (!existingDetail) {
          throw new Error(`Detail with ID ${detail._id} not found`);
        }
        if (detail.type === 'image' && detail.images) {
          const image = await Image.create({
            filePath: detail.images.filePath,
            mimeType: detail.images.mimeType,
            size: detail.images.size,
          });
          existingDetail.type = detail.type;
          existingDetail.images = image._id;
        } else {
          existingDetail.type = detail.type;
          existingDetail.context = detail.context;
        }
        await existingDetail.save();
        return existingDetail;
      } else {
        if (detail.type === 'image' && detail.images) {
          const image = await Image.create({
            filePath: detail.images.filePath,
            mimeType: detail.images.mimeType,
            size: detail.images.size,
          });
          return Detail.create({ type: detail.type, images: image._id });
        } else {
          return Detail.create({ type: detail.type, context: detail.context });
        }
      }
    })
  );

  const updatedDetailIds = updatedDetails.map(detail => detail._id.toString());
  const unusedDetailIds = existingDetailIds.filter(
    id => !updatedDetailIds.includes(id)
  );

  await Promise.all(
    unusedDetailIds.map(async id => {
      const unusedDetail = await Detail.findById(id);
      if (unusedDetail.type === 'image' && unusedDetail.images) {
        await Image.findByIdAndDelete(unusedDetail.images);
      }
      await Detail.findByIdAndDelete(id);
    })
  );

  post.name = name || post.name;
  post.ingredient = ingredient || post.ingredient;
  post.gastronomy = gastronomy || post.gastronomy;
  post.category = category || post.category;
  post.details = updatedDetails.map(detail => detail._id);

  const updatedPost = await post.save();
  return updatedPost;
};

exports.deletePost = async (postId, userId) => {
  const post = await Post.findById(postId).populate('details');
  if (!post) {
    throw new Error('Post not found');
  }

  if (post.userId.toString() !== userId) {
    throw new Error('You do not have permission to delete this post.');
  }

  await Promise.all(
    post.details.map(async detail => {
      if (detail.type === 'image' && detail.images) {
        await Image.findByIdAndDelete(detail.images);
      }
      await Detail.findByIdAndDelete(detail._id);
    })
  );

  await Post.findByIdAndDelete(postId);

  return { message: 'Post deleted successfully' };
};
