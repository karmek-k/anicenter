const { DataTypes } = require('sequelize');

const db = require('../db');

const File = db.define('File', {
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
File.sync();

module.exports = File;