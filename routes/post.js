const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

const { read, list, create, update, remove } = require('../controllers/post');

router.get('/post', list);
router.get('/post/:id', read);
router.post('/post', create);
router.put('/post/:id', update);
router.delete('/post/:id', remove);

module.exports = router;
