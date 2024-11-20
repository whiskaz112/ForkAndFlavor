const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, authorize } = require('../middleware/auth');

const {
  read,
  getAllPosts,
  createPost,
  update,
  remove,
} = require('../controllers/post');

router.get('/posts', getAllPosts);
router.get('/post/:id', read);
router.post(
  '/post',
  authenticate,
  authorize(['user', 'admin']),
  upload.single('image'),
  createPost
);
router.put('/post/:id', update);
router.delete('/post/:id', remove);

module.exports = router;
