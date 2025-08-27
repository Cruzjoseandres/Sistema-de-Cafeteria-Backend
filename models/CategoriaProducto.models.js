const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const CategoriaProducto = sequelize.define(
    "CategoriaProducto",
    {
      categoria_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return CategoriaProducto;
};
