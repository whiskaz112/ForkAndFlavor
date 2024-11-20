const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const { authenticate, authorize } = require('../middleware/auth');
const { myProfile, uploadProfilePic } = require('../controllers/profile')

router.get('/myProfile', authenticate, authorize(['user', 'admin']), myProfile);
router.post('/uploadProfilePic', upload.single('image'), authenticate, authorize(['user', 'admin']), uploadProfilePic);

module.exports = router;