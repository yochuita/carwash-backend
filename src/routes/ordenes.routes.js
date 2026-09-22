const { Router } = require('express');
const router = Router();
const ordenesController = require('../controllers/ordenes.controller');

router.get('/', ordenesController.obtenerOrdenes);
router.get('/:id', ordenesController.obtenerOrdenPorId);
router.post('/', ordenesController.crearOrden);
router.patch('/:id/estado', ordenesController.actualizarEstado);

module.exports = router;
