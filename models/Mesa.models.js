const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
  const Mesa = sequelize.define(
    "Mesa",
    {
      mesa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return Mesa;
};
