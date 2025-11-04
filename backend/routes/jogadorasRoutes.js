const express = require('express');
const router = express.Router();
const jogadorasController = require('../controllers/jogadorasController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rotas Públicas
router.get('/promessas', jogadorasController.getPromessas); 
router.get('/:id', jogadorasController.getJogadoraById); 

// Rotas de Perfil (Jogadora Logada)
router.get('/perfil/meu', authMiddleware, jogadorasController.getMyProfile);
router.put('/perfil/atualizar', authMiddleware, jogadorasController.updateMyProfile);
router.delete('/perfil/excluir', authMiddleware, jogadorasController.deleteMyProfile);

// Rotas de Admin
router.post('/:id/ocultar', authMiddleware, adminMiddleware, jogadorasController.ocultarJogadora);
router.post('/:id/desocultar', authMiddleware, adminMiddleware, jogadorasController.desocultarJogadora);
router.delete('/:id/excluir', authMiddleware, adminMiddleware, jogadorasController.deleteJogadoraAsAdmin);

module.exports = router;