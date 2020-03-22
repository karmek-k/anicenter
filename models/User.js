const { DataTypes } = require('sequelize');

const db = require('../db');

const User = db.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
});
User.sync();

module.exports = User;