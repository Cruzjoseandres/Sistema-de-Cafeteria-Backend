const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Rol = sequelize.define(
    "Roles",
    {
      rol_id: {
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
  return Rol;
};
