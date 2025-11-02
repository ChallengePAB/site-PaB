const express = require('express');
const router = express.Router();
const inscricaoController = require('../controllers/inscricaoController');

router.get('/db', inscricaoController.getDb);
router.get('/times', inscricaoController.getTimes);
router.post('/times', inscricaoController.addTime);
router.get('/jogadoresIndividuais', inscricaoController.getJogadoresIndividuais);
router.post('/jogadoresIndividuais', inscricaoController.addJogadorIndividual);
router.get('/estatisticas', inscricaoController.getEstatisticas);
router.post('/estatisticas', inscricaoController.createEstatisticas);
router.put('/estatisticas/:id', inscricaoController.updateEstatisticas);

module.exports = router;
