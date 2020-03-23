const { Sequelize } = require('sequelize');

const logging = Boolean(Number(process.env.SEQUELIZE_LOGGING));
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging
});
sequelize.authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

module.exports = sequelize;