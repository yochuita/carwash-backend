const pool = require('../config/db');

// Registrar un vehículo
async function crearVehiculo({ placa, marca, modelo, tipo, clienteId }) {
    if (!placa || !marca || !modelo || !tipo || !clienteId) {
        throw new Error('Todos los campos son obligatorios: placa, marca, modelo, tipo, clienteId');
    }

    // Verificar que el cliente existe
    const [cliente] = await pool.execute('SELECT id FROM clientes WHERE id = ?', [clienteId]);
    if (cliente.length === 0) {
        throw new Error(`El cliente con ID ${clienteId} no existe`);
    }

    const query = `
        INSERT INTO vehiculos (placa, marca, modelo, tipo, cliente_id)
        VALUES (?, ?, ?, ?, ?)
    `;
    const values = [placa.toUpperCase(), marca, modelo, tipo.toUpperCase(), clienteId];

    const [resultado] = await pool.execute(query, values);

    const [rows] = await pool.execute('SELECT * FROM vehiculos WHERE id = ?', [resultado.insertId]);
    return rows[0];
}

// Obtener todos los vehículos
async function obtenerVehiculos() {
    const query = `
        SELECT v.*, c.nombre AS cliente_nombre, c.telefono AS cliente_telefono
        FROM vehiculos v
        JOIN clientes c ON v.cliente_id = c.id
        ORDER BY v.fecha_registro DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
}

// Obtener historial de servicios de un vehículo por su placa
async function obtenerHistorialPorPlaca(placa) {
    const [vehiculo] = await pool.execute('SELECT * FROM vehiculos WHERE placa = ?', [placa.toUpperCase()]);
    if (vehiculo.length === 0) {
        throw new Error(`No se encontró ningún vehículo con la placa: ${placa}`);
    }

    const query = 'SELECT * FROM ordenes_trabajo WHERE placa = ? ORDER BY fecha_creacion DESC';
    const [ordenes] = await pool.execute(query, [placa.toUpperCase()]);

    return {
        vehiculo: vehiculo[0],
        totalServicios: ordenes.length,
        historialServicios: ordenes
    };
}

module.exports = {
    crearVehiculo,
    obtenerVehiculos,
    obtenerHistorialPorPlaca
};