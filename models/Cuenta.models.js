const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Cuenta = sequelize.define(
    "Cuenta",
    {
      cuenta_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pedido_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nombre_cliente: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pagado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Cuenta;
};
