const { sequelize } = require("../database/database.js");

// Importación de todos los modelos
const persona = require("./Persona.models")(sequelize);
const usuario = require("./Usuario.models")(sequelize);
const productos = require("./Productos.models")(sequelize);
const categoriaProducto = require("./CategoriaProducto.models")(sequelize);
const cuenta = require("./Cuenta.models")(sequelize);
const detalleCuenta = require("./DetalleCuenta.models")(sequelize);
const imagenProducto = require("./ImagenProducto.models")(sequelize);
const mesa = require("./Mesa.models")(sequelize);
const pedidos = require("./Pedidos.models")(sequelize);
const rol = require("./Rol.models")(sequelize);

// Definición de todas las relaciones
// Relaciones de Usuario
usuario.belongsTo(persona, { foreignKey: "persona_id", as: "persona" });
usuario.belongsTo(rol, { foreignKey: "rol_id", as: "rol" });

// Relaciones de Productos
productos.belongsTo(categoriaProducto, { foreignKey: "categoria_id", as: "categoria" });

// Relaciones de Pedidos
pedidos.belongsTo(usuario, { foreignKey: "usuario_Id", as: "usuario" });
pedidos.belongsTo(mesa, { foreignKey: "mesa_Id", as: "mesa" });

// Relaciones de Cuenta
cuenta.belongsTo(pedidos, { foreignKey: "pedido_id", as: "pedido" });
cuenta.belongsTo(usuario, { foreignKey: "usuario_id", as: "usuario" });

// Relaciones de DetalleCuenta
detalleCuenta.belongsTo(cuenta, { foreignKey: "cuenta_id", as: "cuenta" });
detalleCuenta.belongsTo(productos, { foreignKey: "producto_id", as: "producto" });

// Relaciones de ImagenProducto
imagenProducto.belongsTo(productos, { foreignKey: "producto_id", as: "producto" });

// Relaciones inversas (hasMany)
persona.hasMany(usuario, { foreignKey: "persona_id" });
rol.hasMany(usuario, { foreignKey: "rol_id" });
categoriaProducto.hasMany(productos, { foreignKey: "categoria_id" });
mesa.hasMany(pedidos, { foreignKey: "mesa_Id" });
usuario.hasMany(pedidos, { foreignKey: "usuario_Id" });
pedidos.hasMany(cuenta, { foreignKey: "pedido_id" });
cuenta.hasMany(detalleCuenta, { foreignKey: "cuenta_id" });
productos.hasMany(detalleCuenta, { foreignKey: "producto_id" });
productos.hasMany(imagenProducto, { foreignKey: "producto_id" });

module.exports = {
  persona,
  usuario,
  productos,
  categoriaProducto,
  cuenta,
  detalleCuenta,
  imagenProducto,
  mesa,
  pedidos,
  rol,
  sequelize,
};
