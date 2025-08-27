const express = require ('express');
const router = express.Router();
const UsuariosController = require ('../controllers/Usuarios.controller');

router.post('/login', UsuariosController.login);
router.get('/:id', UsuariosController.getUserById);
router.put('/:id', UsuariosController.updateUser);
router.get('/', UsuariosController.getAllUsers);
router.post('/', UsuariosController.createUser);
router.post('/empleados', UsuariosController.createEmployee);

module.exports = router;
