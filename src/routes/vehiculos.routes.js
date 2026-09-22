const { Router } = require('express');
const router = Router();
const vehiculosController = require('../controllers/vehiculos.controller');

router.get('/', vehiculosController.obtenerVehiculos);
router.get('/:placa/historial', vehiculosController.obtenerHistorial);
router.post('/', vehiculosController.crearVehiculo);

module.exports = router;