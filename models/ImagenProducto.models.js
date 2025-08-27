const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const ImagenProducto = sequelize.define(
    "ImagenProducto",
    {
      imagen_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      producto_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      url_imagen: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fecha_creacion: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      timestamps: false,
    }
  );

  return ImagenProducto;
};
