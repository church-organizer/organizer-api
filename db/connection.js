const Sequelize = require('sequelize');
let sequelize = null;
const connect= () => {
    try{
        sequelize = new Sequelize(process.env.DB_NAME || 'wikidb', process.env.DB_USERNAME || 'root', process.env.DB_PASSWORD || '1234', {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
            port: 3306,
            dialectOptions: {
                connectTimeout: 4000
            }
        });
    } catch (e) {
        console.log("Konnte keine Verbindung zur DB herstellen");
        setTimeout(()=> connect(), 1000);
    }

};

connect();

module.exports = sequelize;
