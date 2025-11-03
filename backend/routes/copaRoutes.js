const express = require('express');
const router = express.Router();
const copaController = require('../controllers/copaController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rota pública para dados da copa
router.get('/', copaController.getCopa);

// Rota admin para atualizar a copa
router.put('/atualizar', authMiddleware, adminMiddleware, copaController.updateCopa);

module.exports = router;
