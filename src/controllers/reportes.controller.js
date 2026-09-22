const reportesService = require('../services/reportes.service');

const obtenerMetricas = async (req, res) => {
    try {
        const { mes, anio } = req.query;
        const metricas = await reportesService.obtenerMetricasGenerales(mes, anio);
        res.json({
            ok: true,
            data: metricas
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

const obtenerHorasPico = async (req, res) => {
    try {
        const horasPico = await reportesService.obtenerHorasPico();
        res.json({
            ok: true,
            data: horasPico
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

const obtenerDesempeño = async (req, res) => {
    try {
        const desempeño = await reportesService.obtenerDesempeñoVehicular();
        res.json({
            ok: true,
            data: desempeño
        });
    } catch (error) {
        res.status(500).json({ ok: false, mensaje: error.message });
    }
};

module.exports = {
    obtenerMetricas,
    obtenerHorasPico,
    obtenerDesempeño
};