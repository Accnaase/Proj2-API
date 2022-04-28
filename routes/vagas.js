const express = require('express');
const router = express.Router();
const VagasController = require('../controllers/vagas_controller')

// METODO GET ALL
router.get('/', VagasController.getVagas);
//METODO POST
router.post('/cadastro', VagasController.postVagas);
//METODO GET ID
router.get('/:id_vaga', VagasController.getVagasId);
//METODO PATCH
router.patch('/editar/:id_vaga', VagasController.patchVagas);
//METODO DELETE
router.delete('/:id_vaga', VagasController.deleteVagas);

module.exports = router;