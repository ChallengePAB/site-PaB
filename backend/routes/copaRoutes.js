const express = require('express');
const router = express.Router();
const copaController = require('../controllers/copaController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', copaController.getCopa);

router.put('/atualizar', authMiddleware, adminMiddleware, copaController.updateCopa);

module.exports = router;
