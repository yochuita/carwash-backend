const pool = require('../config/db');

const METODOS_PAGO_PERMITIDOS = ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA'];

// Registra un pago / procesa la factura de una orden
async function registrarPago({ ordenId, metodoPago, montoRecibido }) {
    if (!ordenId || !metodoPago || montoRecibido === undefined) {
        throw new Error('Los campos ordenId, metodoPago y montoRecibido son obligatorios');
    }

    const metodoUpper = metodoPago.toUpperCase();
    if (!METODOS_PAGO_PERMITIDOS.includes(metodoUpper)) {
        throw new Error(`Método de pago no válido. Permitidos: ${METODOS_PAGO_PERMITIDOS.join(', ')}`);
    }

    // Verificar existencia de la orden
    const [ordenes] = await pool.execute('SELECT * FROM ordenes_trabajo WHERE id = ?', [ordenId]);
    if (ordenes.length === 0) {
        throw new Error(`No existe ninguna orden de trabajo con ID ${ordenId}`);
    }

    const orden = ordenes[0];

    // Verificar si ya fue pagada/facturada
    const [facturaExistente] = await pool.execute('SELECT * FROM facturas WHERE orden_id = ?', [ordenId]);
    if (facturaExistente.length > 0) {
        throw new Error(`La orden de trabajo ${ordenId} ya fue facturada anteriormente`);
    }

    const montoTotal = Number(orden.total);
    const recibido = Number(montoRecibido);

    if (recibido < montoTotal) {
        throw new Error(`El monto recibido ($${recibido}) es menor al total a pagar ($${montoTotal})`);
    }

    const cambio = recibido - montoTotal;

    // Registrar la factura
    const insertQuery = `
        INSERT INTO facturas (orden_id, metodo_pago, monto_total, monto_recibido, cambio)
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.execute(insertQuery, [ordenId, metodoUpper, montoTotal, recibido, cambio]);

    // Marcar la orden como FINALIZADO o COMPLETADO al pagarse
    await pool.execute("UPDATE ordenes_trabajo SET estado = 'FINALIZADO' WHERE id = ?", [ordenId]);

    const [factura] = await pool.execute('SELECT * FROM facturas WHERE id = ?', [result.insertId]);
    return factura[0];
}

// Consultar factura por ID
async function obtenerFacturaPorId(id) {
    const query = `
        SELECT f.*, o.placa, o.tipo_vehiculo
        FROM facturas f
        JOIN ordenes_trabajo o ON f.orden_id = o.id
        WHERE f.id = ?
    `;
    const [rows] = await pool.execute(query, [id]);

    if (rows.length === 0) {
        throw new Error(`Factura con ID ${id} no encontrada`);
    }

    return rows[0];
}

// Cierre diario de caja (Arqueo de ingresos)
async function realizarCierreDiario(fecha) {
    // Si no se pasa fecha, se toma la fecha actual en formato YYYY-MM-DD
    const fechaConsulta = fecha || new Date().toISOString().split('T')[0];

    const queryIngresos = `
        SELECT 
            metodo_pago,
            SUM(monto_total) AS total,
            COUNT(*) AS cantidad
        FROM facturas
        WHERE DATE(fecha_pago) = ?
        GROUP BY metodo_pago
    `;

    const [filas] = await pool.execute(queryIngresos, [fechaConsulta]);

    let totalEfectivo = 0;
    let totalTarjeta = 0;
    let totalTransferencia = 0;
    let totalOrdenes = 0;

    filas.forEach(fila => {
        const monto = Number(fila.total);
        totalOrdenes += Number(fila.cantidad);

        if (fila.metodo_pago === 'EFECTIVO') totalEfectivo += monto;
        if (fila.metodo_pago === 'TARJETA') totalTarjeta += monto;
        if (fila.metodo_pago === 'TRANSFERENCIA') totalTransferencia += monto;
    });

    const totalRecaudado = totalEfectivo + totalTarjeta + totalTransferencia;

    // Insertar o actualizar el cierre de caja del día
    const upsertQuery = `
        INSERT INTO cierres_caja (fecha, total_efectivo, total_tarjeta, total_transferencia, total_recaudado, total_ordenes)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            total_efectivo = VALUES(total_efectivo),
            total_tarjeta = VALUES(total_tarjeta),
            total_transferencia = VALUES(total_transferencia),
            total_recaudado = VALUES(total_recaudado),
            total_ordenes = VALUES(total_ordenes),
            fecha_cierre = CURRENT_TIMESTAMP
    `;

    await pool.execute(upsertQuery, [
        fechaConsulta,
        totalEfectivo,
        totalTarjeta,
        totalTransferencia,
        totalRecaudado,
        totalOrdenes
    ]);

    return {
        fecha: fechaConsulta,
        resumen: {
            efectivo: totalEfectivo,
            tarjeta: totalTarjeta,
            transferencia: totalTransferencia,
            totalRecaudado,
            totalOrdenesFacturadas: totalOrdenes
        }
    };
}

module.exports = {
    registrarPago,
    obtenerFacturaPorId,
    realizarCierreDiario
};