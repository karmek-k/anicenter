const { DataTypes } = require('sequelize');

const db = require('../config/db');

const File = db.define('file', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true
});

module.exports = File;