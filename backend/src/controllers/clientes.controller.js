const clientesService = require('../services/clientes.service');

const crearCliente = async (req, res) => {
    try {
        const cliente = await clientesService.crearCliente(req.body);
        res.status(201).json({
            ok: true,
            mensaje: 'Cliente registrado exitosamente',
            data: cliente
        });
    } catch (error) {
        res.status(400).json({ ok: false, mensaje: error.message });
    }
};

const obtenerClientes = async (req, res) => {
    try {
        const clientes = await clientesService.obtenerClientes();
        res.json({
            ok: true,
            total: clientes.length,
            data: clientes
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

const obtenerClientePorId = async (req, res) => {
    try {
        const cliente = await clientesService.obtenerClientePorId(req.params.id);
        res.json({
            ok: true,
            data: cliente
        });
    } catch (error) {
        res.status(404).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId
};