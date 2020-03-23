const { Sequelize } = require('sequelize');

const sequelizeLogging = Boolean(Number(process.env.SEQUELIZE_LOGGING));
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: sequelizeLogging ? console.log : false
});
sequelize.authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

module.exports = sequelize;