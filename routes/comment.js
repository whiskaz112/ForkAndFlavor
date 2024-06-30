const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const {
  addComment,
  updateComment,
  deleteComment,
} = require('../controllers/comment');

router.post('/post/:id/comment', addComment);
router.put('/post/:postId/comment/:commentId', updateComment);
router.delete('/post/:postId/comment/:commentId', deleteComment);

module.exports = router;
