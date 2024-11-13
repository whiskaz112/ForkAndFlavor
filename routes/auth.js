const express = require('express');
const { register, login } = require('../controllers/auth');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/user', authenticate, authorize(['user', 'admin']), (req, res) => {
  res.json({ message: 'Welcome User' });
});

router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Welcome Admin' });
});

module.exports = router;
