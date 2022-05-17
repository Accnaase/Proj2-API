const express = require('express');
const router = express.Router();
const EmpresasController = require('../controllers/empresas_controller')

// METODO GET ALL
router.get('/', EmpresasController.getEmpresas)
//METODO GET ID
router.get('/:id_empresa', EmpresasController.getEmpresaId);
//METODO GET VAGAS EMPRESAS POR ID
router.get('/vagas/:id_empresa', EmpresasController.getVagasDeUmaEmpresa);
//METODO POST
router.post('/', EmpresasController.postEmpresa);
//METODO PATCH
router.patch('/editar/:id_empresa',EmpresasController.patchEmpresas);
//METODO DELETE
router.delete('/:id_empresa', EmpresasController.deleteEmpresa);


module.exports = router;

