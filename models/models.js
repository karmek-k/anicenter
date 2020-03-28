const db = require('../db');
const User = require('./User');
const File = require('./File');

User.hasMany(File);
File.belongsTo(User);

db.sync();

module.exports = {
  User,
  File
};