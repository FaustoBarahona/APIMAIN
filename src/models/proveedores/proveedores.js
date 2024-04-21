const Sequelize = require("sequelize");
const db = require("../../Config/db");

const Proveedor = db.define(
  "proveedor",
  {
    rtn: {
      type: Sequelize.STRING(18),
      allowNull: false,
      unique: {
        args: true,
        msg: "Ya está registrado este RTN.",
      },
      validate: {
        notEmpty: { msg: "Debe escribir el RTN del proveedor." },
      },
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Debe escribir el nombre del proveedor." },
      },
    },
    direccion: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    correo: {
      type: Sequelize.STRING(100),
      allowNull: true,
      validate: {
        isEmail: { msg: "Debe proporcionar un correo electrónico válido." },
      },
    },
    activo: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
  },
  {
    tableName: "proveedores",
  }
);

module.exports = Proveedor;
