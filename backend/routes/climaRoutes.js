const express = require('express');
const router = express.Router();
const { getClima, updateClima } = require('../controllers/climaController');

router.get('/clima', getClima);
router.post('/clima/update', updateClima);

module.exports = router;