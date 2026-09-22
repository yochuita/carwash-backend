const { Router } = require('express');
const router = Router();
const cajaController = require('../controllers/caja.controller');

router.post('/pagar', cajaController.registrarPago);
router.get('/facturas/:id', cajaController.obtenerFactura);
router.get('/cierre', cajaController.cierreCaja);

module.exports = router;