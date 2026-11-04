const { Router } = require('express');
const router = Router();
const clientesController = require('../controllers/clientes.controller');

router.get('/', clientesController.obtenerClientes);
router.get('/:id', clientesController.obtenerClientePorId);
router.post('/', clientesController.crearCliente);

// ESENCIAL: exportar el router
module.exports = router;