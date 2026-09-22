const serviciosService = require('../services/servicios.service');

const crearServicio = async (req, res) => {
    try {
        const servicio = await serviciosService.crearServicio(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Servicio registrado exitosamente en el catálogo',
            data: servicio
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const obtenerServicios = async (req, res) => {
    try {
        const servicios = await serviciosService.obtenerServicios();
        res.json({
            ok: true,
            total: servicios.length,
            data: servicios
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

const calcularTarifa = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipoVehiculo } = req.query;
        const tarifa = await serviciosService.calcularTarifaServicio(id, tipoVehiculo);
        res.json({
            ok: true,
            data: tarifa
        });
    } catch (error) {
        res.status(404).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    crearServicio,
    obtenerServicios,
    calcularTarifa
};