const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); 
const { authMiddleware, adminMiddleware } = require('../middlewares/authMiddleware'); 

router.use(authMiddleware, adminMiddleware);

router.get('/non-jogadoras', userController.getNonJogadoraUsers);
router.post('/:userId/make-jogadora', userController.makeUserJogadora);
router.post('/:userId/make-admin', userController.makeUserAdmin);
router.delete('/:userId', userController.deleteUser);

module.exports = router;
