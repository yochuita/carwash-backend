const { Router } = require('express');
const router = Router();
const serviciosController = require('../controllers/servicios.controller');

router.get('/', serviciosController.obtenerServicios);
router.get('/:id/tarifa', serviciosController.calcularTarifa);
router.post('/', serviciosController.crearServicio);

module.exports = router;
