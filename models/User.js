const { DataTypes } = require('sequelize');

const db = require('../db');

const User = db.define('User', {
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  timestamps: true
});
User.sync();

module.exports = User;