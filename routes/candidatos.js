const express = require('express');
const router = express.Router();
const CandidatosController = require('../controllers/candidatos_controller');

router.post('/cadastro', CandidatosController.postCandidatura);

router.get('/buscar/vagas/:id_vaga', CandidatosController.getCandidatosIdVaga);

router.get('/buscar/usuarios/:id_usuario', CandidatosController.getCandidatosIdUsuario);

router.delete('/', CandidatosController.deleteCandidato)

module.exports = router