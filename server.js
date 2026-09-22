
require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Importar rutas
const ordenesRoutes = require('./src/routes/ordenes.routes');
const clientesRoutes = require('./src/routes/clientes.routes');
const vehiculosRoutes = require('./src/routes/vehiculos.routes');
const serviciosRoutes = require('./src/routes/servicios.routes');
const cajaRoutes = require('./src/routes/caja.routes');
const reportesRoutes = require('./src/routes/reportes.routes');





// Usar rutas
app.use('/api/v1/ordenes', ordenesRoutes);
app.use('/api/v1/clientes', clientesRoutes);
app.use('/api/v1/vehiculos', vehiculosRoutes);
app.use('/api/v1/servicios', serviciosRoutes);
app.use('/api/v1/caja', cajaRoutes);
app.use('/api/v1/reportes', reportesRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});