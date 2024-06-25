const express = require('express');
const router = express.Router();

const { register, login, list} = require('../controllers/auth');

//http://localhost:5000/api/auth
router.post('/register', register);
router.post('/login', login);
router.get('/showUser', list);

module.exports = router;
