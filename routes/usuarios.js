const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios_controller');
const login = require('../middleware/login')

//GET ALL 
router.get('/', UsuariosController.getUsuarios);

//GET ID
router.get('/:id_usuario', login.obrigatorio, UsuariosController.getUsuarioID);

//POST USUARIO
router.post('/cadastro', UsuariosController.cadastroUsuario);

//PACTH USUARIO
router.patch('/editar/:id_usuario', UsuariosController.patchUsuario);

//LOGIN USUARIO
router.post('/login', UsuariosController.loginUsuario);

//DELETE USUARIO
router.delete('/:id_usuario', UsuariosController.deleteUsuario);

module.exports = router;