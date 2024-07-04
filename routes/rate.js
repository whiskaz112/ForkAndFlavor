const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const { ratePost } = require('../controllers/rate');

router.post('/post/:postId/rate', ratePost);

module.exports = router;
