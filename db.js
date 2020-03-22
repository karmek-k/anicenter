const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL);
sequelize.authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

module.exports = sequelize;