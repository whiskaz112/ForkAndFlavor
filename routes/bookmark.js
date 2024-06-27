const express = require('express');
const router = express.Router();

const { bookmark, unbookmark, getBookmark } = require('../controllers/bookmark');

router.post('/bookmark/:userId/:postId', bookmark);
router.post('/unbookmark/:userId/:postId', unbookmark);
router.get('/bookmark/:userId', getBookmark);

module.exports = router;