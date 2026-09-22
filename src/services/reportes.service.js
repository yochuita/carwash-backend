const pool = require('../config/db');

// 1. Obtener métricas generales (diarias o mensuales)
async function obtenerMetricasGenerales(mes, anio) {
    const mesConsulta = mes || new Date().getMonth() + 1;
    const anioConsulta = anio || new Date().getFullYear();

    // Total recaudado y cantidad de facturas en el mes
    const queryFinanzas = `
        SELECT 
            COUNT(*) AS total_facturas,
            COALESCE(SUM(monto_total), 0) AS total_recaudado,
            COALESCE(AVG(monto_total), 0) AS ticket_promedio
        FROM facturas
        WHERE MONTH(fecha_pago) = ? AND YEAR(fecha_pago) = ?
    `;

    // Servicios más solicitados (agrupados por la orden de trabajo)
    const queryServiciosTop = `
        SELECT 
            tipo_vehiculo,
            COUNT(*) AS cantidad
        FROM ordenes_trabajo
        WHERE MONTH(fecha_creacion) = ? AND YEAR(fecha_creacion) = ?
        GROUP BY tipo_vehiculo
        ORDER BY cantidad DESC
    `;

    const [finanzas] = await pool.execute(queryFinanzas, [mesConsulta, anioConsulta]);
    const [serviciosTop] = await pool.execute(queryServiciosTop, [mesConsulta, anioConsulta]);

    return {
        periodo: { mes: Number(mesConsulta), anio: Number(anioConsulta) },
        finanzas: finanzas[0],
        serviciosTop
    };
}

// 2. Reporte de Horas Pico (Flujo de vehículos según la hora de ingreso)
async function obtenerHorasPico() {
    const query = `
        SELECT 
            HOUR(fecha_creacion) AS hora,
            COUNT(*) AS total_vehiculos
        FROM ordenes_trabajo
        GROUP BY HOUR(fecha_creacion)
        ORDER BY total_vehiculos DESC
    `;

    const [rows] = await pool.execute(query);
    return rows;
}

// 3. Desempeño y volumen de servicios por tipo de vehículo
async function obtenerDesempeñoVehicular() {
    const query = `
        SELECT 
            tipo_vehiculo,
            COUNT(*) AS total_atendidos,
            SUM(total) AS total_generado
        FROM ordenes_trabajo
        WHERE estado = 'FINALIZADO'
        GROUP BY tipo_vehiculo
        ORDER BY total_generado DESC
    `;

    const [rows] = await pool.execute(query);
    return rows;
}

module.exports = {
    obtenerMetricasGenerales,
    obtenerHorasPico,
    obtenerDesempeñoVehicular
};