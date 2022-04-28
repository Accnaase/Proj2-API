const express = require('express');
const router = express.Router();
const EmpresasController = require('../controllers/empresas_controller')

// METODO GET ALL
router.get('/', EmpresasController.getEmpresas)
//METODO GET ID
router.get('/:id_empresa', EmpresasController.getEmpresaId);
//METODO POST
router.post('/cadastro', EmpresasController.postEmpresa);
//METODO PATCH
router.patch('/editar/:id_empresa', EmpresasController.patchEmpresas);
//METODO DELETE
router.delete('/:id_empresa', EmpresasController.deleteEmpresa);


module.exports = router;