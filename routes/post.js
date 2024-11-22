const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

const {
  read,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/post');

router.get('/posts', getAllPosts);
router.get('/post/:id', read);
router.post(
  '/post',
  authenticate,
  authorize(['user', 'admin']),
  upload.array('image', 10),
  createPost
);
router.put(
  '/post/:id',
  authenticate,
  authorize(['user', 'admin']),
  upload.array('image', 10),
  updatePost
);
router.delete(
  '/post/:id',
  authenticate,
  authorize(['user', 'admin']),
  upload.array('image', 10),
  deletePost
);

module.exports = router;
