const express = require('express');
const router = express.Router();

// Importa a lógica do controlador 
const kpiController = require('../controllers/kpiController');

//IMPORTAÇÃO DO MIDDLEWARE 
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware');

// Rota: GET /api/admin/kpi/ranking-tags
router.get(
    '/ranking-tags', 
    authMiddleware, 
    adminMiddleware, 
    kpiController.getRankingTags
);

// Rota: GET /api/admin/kpi/visitantes
router.get(
    '/visitantes', 
    authMiddleware, 
    adminMiddleware, 
    kpiController.getVisitantes
);

// Rota: GET /api/admin/kpi/comparativo
router.get(
    '/comparativo', 
    authMiddleware, 
    adminMiddleware, 
    kpiController.getComparativo
);

module.exports = router;