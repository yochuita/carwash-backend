const { Router } = require('express');
const router = Router();
const reportesController = require('../controllers/reportes.controller');

router.get('/metricas', reportesController.obtenerMetricas);
router.get('/horas-pico', reportesController.obtenerHorasPico);
router.get('/desempeno', reportesController.obtenerDesempeño);

module.exports = router;