const User = require('./User');
const File = require('./File');

User.hasMany(File);
File.belongsTo(User);

module.exports = {
  User,
  File
};