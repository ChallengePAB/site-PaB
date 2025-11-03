const express = require('express');
const router = express.Router();
const encontroController = require('../controllers/encontroController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Colocar depois a rota para a API do clima


// Rota pública para dados do encontro
router.get('/', encontroController.getEncontro);

// Rota admin para atualizar o encontro
router.put('/atualizar', authMiddleware, adminMiddleware, encontroController.updateEncontro);

module.exports = router;
