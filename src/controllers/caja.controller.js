const cajaService = require('../services/caja.service');

const registrarPago = async (req, res) => {
    try {
        const factura = await cajaService.registrarPago(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Pago registrado y orden facturada con éxito',
            data: factura
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const obtenerFactura = async (req, res) => {
    try {
        const { id } = req.params;
        const factura = await cajaService.obtenerFacturaPorId(id);
        res.json({
            ok: true,
            data: factura
        });
    } catch (error) {
        res.status(404).json({ ok: false, mensaje: error.message });
    }
};

const cierreCaja = async (req, res) => {
    try {
        const { fecha } = req.query;
        const resumenCierre = await cajaService.realizarCierreDiario(fecha);
        res.json({
            ok: true,
            mensaje: 'Cierre de caja generado correctamente',
            data: resumenCierre
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    registrarPago,
    obtenerFactura,
    cierreCaja
};