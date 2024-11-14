const express = require('express');
const router = express.Router();

// handle file upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

const { authenticate, authorize } = require('../middleware/auth');
const { register, login, getUser, uploadPic } = require('../controllers/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/getUser', getUser);
router.post('/uploadPic', upload.single('myFile'), uploadPic);

router.get('/user', authenticate, authorize(['user', 'admin']), (req, res) => {
  res.json({ message: 'Welcome User' });
});

router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
