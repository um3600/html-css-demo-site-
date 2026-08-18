const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, getAllUsers, deleteUser } = require('../controllers/authController');
const { auth, adminAuth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);
router.get('/users', auth, adminAuth, getAllUsers);
router.delete('/users/:id', auth, adminAuth, deleteUser);

module.exports = router;
