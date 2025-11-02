const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rotas Públicas
router.get('/', newsController.getAllNews);
router.get('/:id', newsController.getNewsById);

// Rotas Protegidas (Admin)
router.post('/', authMiddleware, adminMiddleware, newsController.createNews);
router.put('/:id', authMiddleware, adminMiddleware, newsController.updateNews);
router.delete('/:id', authMiddleware, adminMiddleware, newsController.deleteNews);

module.exports = router;
