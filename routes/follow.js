const express = require('express');
const router = express.Router();

const { followFunc, unfollowFunc, followList, deleteFollow} = require('../controllers/follow');

router.post('/follow/:id', followFunc);
router.post('/unfollow/:id', unfollowFunc);
router.get('/follow/list/:id', followList);
router.delete('/follow/:id/:delId', deleteFollow);

module.exports = router;