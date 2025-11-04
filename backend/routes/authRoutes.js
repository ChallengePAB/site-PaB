const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');

// Rota: GET /auth/me
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next));

// Rota: POST /auth/register
router.post('/register', authController.register);

// Rota: POST /auth/login
router.post('/login', authController.login);

// Rota: PUT /auth/update-profile
router.put('/update-profile', authMiddleware, authController.updateProfile);

module.exports = router;