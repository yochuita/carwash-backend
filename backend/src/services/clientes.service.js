const pool = require('../config/db');

// Registrar un cliente
async function crearCliente({ nombre, telefono, email }) {
    if (!nombre || !telefono) {
        throw new Error('El nombre y el teléfono son obligatorios');
    }

    const query = 'INSERT INTO clientes (nombre, telefono, email) VALUES (?, ?, ?)';
    const [resultado] = await pool.execute(query, [nombre, telefono, email || null]);

    const [rows] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [resultado.insertId]);
    return rows[0];
}

// Obtener todos los clientes
async function obtenerClientes() {
    const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY fecha_registro DESC');
    return rows;
}

// Obtener cliente con sus vehículos
async function obtenerClientePorId(id) {
    const [cliente] = await pool.execute('SELECT * FROM clientes WHERE id = ?', [id]);
    if (cliente.length === 0) {
        throw new Error(`Cliente con ID ${id} no encontrado`);
    }

    const [vehiculos] = await pool.execute('SELECT * FROM vehiculos WHERE cliente_id = ?', [id]);

    return {
        ...cliente[0],
        vehiculos
    };
}

module.exports = {
    crearCliente,
    obtenerClientes,
    obtenerClientePorId
};