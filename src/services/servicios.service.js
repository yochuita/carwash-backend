const pool = require('../config/db');

// Multiplicadores estandarizados por tipo de vehículo
const MULTIPLICADORES = {
    SEDAN: 1.0,
    SUV: 1.25,
    CAMIONETA: 1.5
};

// Crear un nuevo servicio en el catálogo
async function crearServicio({ nombre, descripcion, precioBase }) {
    if (!nombre || !precioBase) {
        throw new Error('El nombre y el precio base son obligatorios');
    }

    const query = 'INSERT INTO servicios (nombre, descripcion, precio_base) VALUES (?, ?, ?)';
    const [resultado] = await pool.execute(query, [nombre, descripcion || null, precioBase]);

    const [rows] = await pool.execute('SELECT * FROM servicios WHERE id = ?', [resultado.insertId]);
    return rows[0];
}

// Obtener todos los servicios activos
async function obtenerServicios() {
    const query = 'SELECT * FROM servicios WHERE activo = TRUE ORDER BY id ASC';
    const [rows] = await pool.execute(query);
    return rows;
}

// Obtener tarifa calculada según el tipo de vehículo
async function calcularTarifaServicio(servicioId, tipoVehiculo) {
    const [servicios] = await pool.execute('SELECT * FROM servicios WHERE id = ? AND activo = TRUE', [servicioId]);
    
    if (servicios.length === 0) {
        throw new Error(`El servicio con ID ${servicioId} no existe o no está activo`);
    }

    const servicio = servicios[0];
    const tipoUpper = tipoVehiculo ? tipoVehiculo.toUpperCase() : 'SEDAN';
    const multiplicador = MULTIPLICADORES[tipoUpper] || 1.0;
    const precioFinal = servicio.precio_base * multiplicador;

    return {
        servicioId: servicio.id,
        nombre: servicio.nombre,
        tipoVehiculo: tipoUpper,
        precioBase: servicio.precio_base,
        multiplicador,
        precioFinal
    };
}

module.exports = {
    crearServicio,
    obtenerServicios,
    calcularTarifaServicio
};