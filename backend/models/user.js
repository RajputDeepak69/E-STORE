const { DataTypes } = require("sequelize");
const sequelize = require("../db/db");

const User = sequelize.define("User", {
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false } // 👈 new field
});

module.exports = User;