const ordenesService = require('../services/ordenes.service');

// 1. Obtener todas las órdenes o filtrar por placa
const obtenerOrdenes = async (req, res) => {
    try {
        const { placa } = req.query;
        const ordenes = await ordenesService.obtenerOrdenes(placa);
        res.json({
            ok: true,
            total: ordenes.length,
            data: ordenes
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

// 2. Obtener orden por ID
const obtenerOrdenPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const orden = await ordenesService.obtenerOrdenPorId(id);
        res.json({
            ok: true,
            data: orden
        });
    } catch (error) {
        res.status(404).json({ ok: false, mensaje: error.message });
    }
};

// 3. Crear una nueva orden
const crearOrden = async (req, res) => {
    try {
        const nuevaOrden = await ordenesService.crearOrden(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Orden creada exitosamente',
            data: nuevaOrden
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

// 4. Actualizar estado de una orden
const actualizarEstado = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        const ordenActualizada = await ordenesService.actualizarEstadoOrden(id, estado);

        res.json({
            ok: true,
            mensaje: 'Estado actualizado correctamente',
            data: ordenActualizada
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    obtenerOrdenes,
    obtenerOrdenPorId,
    crearOrden,
    actualizarEstado
};