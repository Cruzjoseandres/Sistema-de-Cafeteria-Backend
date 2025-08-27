require('dotenv').config();

const db = require("./models/")
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const personaRouter = require('./routes/Personas.routes.js');
const rolRouter = require ('./routes/Rol.routes.js');
const usuarioRouter = require ('./routes/Usuarios.routes.js');
/*const categoriaProductoRouter = require('./routes/CategoriaProducto.routes.js');
const cuentaRouter = require('./routes/Cuenta.routes.js');  
const detalleCuentaRouter = require ('./routes/DetalleCuenta.routes.js');
const imagenProductoRouter = require ('./routes/ImagenProducto.routes.js');   
const mesaRouter = require ('./routes/Mesa.routes.js');
const pedidosRouter = require ('./routes/Pedidos.routes.js');
*/

app.use('/api/personas', personaRouter);
app.use('/api/rol', rolRouter);
app.use('/api/usuario', usuarioRouter);
/*app.use('/api/categoriaProducto', categoriaProductoRouter);
app.use('/api/cuenta', cuentaRouter);
app.use('/api/detalleCuenta', detalleCuentaRouter);
app.use('/api/imagenProducto', imagenProductoRouter);
app.use('/api/mesa', mesaRouter);
app.use('/api/pedidos', pedidosRouter);
app.use('/api/rol', rolRouter);

*/
db.sequelize.sync({
     force: false // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});

