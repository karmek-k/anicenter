const { Sequelize } = require('sequelize');

// use an in-memory database for testing
let databaseUrl, sequelizeLogging;
if (process.env.NODE_ENV.toLowerCase() === 'test') {
  databaseUrl = 'sqlite::memory:';
  sequelizeLogging = false;
}
else {
  databaseUrl = process.env.DATABASE_URL;
  sequelizeLogging = Boolean(Number(process.env.SEQUELIZE_LOGGING));
}

const sequelize = new Sequelize(databaseUrl, {
  logging: sequelizeLogging ? console.log : false
});
sequelize.authenticate()
  .then(() => console.log('Successfully connected to the database'))
  .catch(err => console.error(err));

module.exports = sequelize;