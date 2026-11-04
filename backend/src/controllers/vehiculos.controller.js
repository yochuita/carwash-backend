const vehiculosService = require('../services/vehiculos.service');

const crearVehiculo = async (req, res) => {
    try {
        const vehiculo = await vehiculosService.crearVehiculo(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Vehículo registrado exitosamente',
            data: vehiculo
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const obtenerVehiculos = async (req, res) => {
    try {
        const vehiculos = await vehiculosService.obtenerVehiculos();
        res.json({
            ok: true,
            total: vehiculos.length,
            data: vehiculos
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

const obtenerHistorial = async (req, res) => {
    try {
        const { placa } = req.params;
        const historial = await vehiculosService.obtenerHistorialPorPlaca(placa);
        res.json({
            ok: true,
            data: historial
        });
    } catch (error) {
        res.status(404).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    crearVehiculo,
    obtenerVehiculos,
    obtenerHistorial
};