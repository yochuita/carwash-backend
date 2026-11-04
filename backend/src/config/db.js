const mysql = require('mysql2/promise');
require('dotenv').config();

// Crear el pool de conexiones usando la versión de Promesas
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar la conexión al iniciar
pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado exitosamente a la Base de Datos MySQL');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Error al conectar a MySQL:', err.message);
    });

module.exports = pool;