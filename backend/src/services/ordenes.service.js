const pool = require('../config/db');

// Multiplicadores según tipo de vehículo
const MULTIPLICADORES = {
    SEDAN: 1.0,
    SUV: 1.25,
    CAMIONETA: 1.5
};

// Lista de estados permitidos
const ESTADOS_PERMITIDOS = ['EN_ESPERA', 'LAVANDO', 'FINALIZADO', 'CANCELADO'];

// 1. Crear una nueva orden
async function crearOrden({ placa, tipoVehiculo, precioBase }) {
    const multiplicador = MULTIPLICADORES[tipoVehiculo.toUpperCase()] || 1.0;
    const total = precioBase * multiplicador;

    const query = `
        INSERT INTO ordenes_trabajo (placa, tipo_vehiculo, precio_base, total, estado)
        VALUES (?, ?, ?, ?, 'EN_ESPERA')
    `;
    const values = [placa.toUpperCase(), tipoVehiculo.toUpperCase(), precioBase, total];

    const [result] = await pool.execute(query, values);

    const [rows] = await pool.execute('SELECT * FROM ordenes_trabajo WHERE id = ?', [result.insertId]);
    return rows[0];
}

// 2. Obtener todas las órdenes (o filtrar por placa)
async function obtenerOrdenes(placa) {
    if (placa) {
        const query = 'SELECT * FROM ordenes_trabajo WHERE placa = ? ORDER BY fecha_creacion DESC';
        const [rows] = await pool.execute(query, [placa.toUpperCase()]);
        return rows;
    }

    const [rows] = await pool.execute('SELECT * FROM ordenes_trabajo ORDER BY fecha_creacion DESC');
    return rows;
}

// 3. Obtener orden por ID
async function obtenerOrdenPorId(id) {
    const query = 'SELECT * FROM ordenes_trabajo WHERE id = ?';
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
        throw new Error(`No se encontró ninguna orden con el ID: ${id}`);
    }

    return rows[0];
}

// 4. Actualizar estado de una orden
async function actualizarEstadoOrden(id, nuevoEstado) {
    if (!nuevoEstado) {
        throw new Error('El campo "estado" es requerido');
    }

    const estadoUpper = nuevoEstado.toUpperCase();

    if (!ESTADOS_PERMITIDOS.includes(estadoUpper)) {
        throw new Error(`Estado no válido. Permite: ${ESTADOS_PERMITIDOS.join(', ')}`);
    }

    const query = 'UPDATE ordenes_trabajo SET estado = ? WHERE id = ?';
    const [result] = await pool.execute(query, [estadoUpper, id]);

    if (result.affectedRows === 0) {
        throw new Error(`No se encontró ninguna orden con el ID: ${id}`);
    }

    const [rows] = await pool.execute('SELECT * FROM ordenes_trabajo WHERE id = ?', [id]);
    return rows[0];
}

module.exports = {
    crearOrden,
    obtenerOrdenes,
    obtenerOrdenPorId,
    actualizarEstadoOrden
};