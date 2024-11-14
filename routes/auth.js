const express = require('express');
const router = express.Router();

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

const { register, login, getUser, uploadPic } = require('../controllers/auth');

//http://localhost:5000/api/auth
router.post('/register', register);
router.post('/login', login);
router.get('/getUser', getUser);
router.post('/uploadPic', upload.single('myFile'), uploadPic);

module.exports = router;
