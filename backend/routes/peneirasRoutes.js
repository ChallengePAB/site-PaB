const express = require('express');
const router = express.Router();
const peneirasController = require('../controllers/peneirasController');

// Rota: GET /peneiras
router.get('/', peneirasController.getPeneiras);

module.exports = router;
