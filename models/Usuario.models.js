const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Usuario = sequelize.define(
    "Usuario",
    {
      usuario_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      persona_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rol_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Usuario;
};
