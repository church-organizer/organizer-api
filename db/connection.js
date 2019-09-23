const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME || 'wikidb', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '1234', {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: 3306
});

export default sequelize;
