const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Pedido = sequelize.define(
    "Pedido",
    {
      pedido_Id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mesa_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      usuario_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fecha: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Pedido;
};
