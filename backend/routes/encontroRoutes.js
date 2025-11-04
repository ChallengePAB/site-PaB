const express = require('express');
const router = express.Router();
const encontroController = require('../controllers/encontroController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

router.get('/', encontroController.getEncontro);
router.put('/atualizar', authMiddleware, adminMiddleware, encontroController.updateEncontro);

module.exports = router;
