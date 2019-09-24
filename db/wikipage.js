const Sequelize = require('sequelize');
const Model = require('sequelize').Model;
const sequelize = require('./connection');
const User = require('./user');

class WikiPage extends Model{}

WikiPage.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: Sequelize.STRING, allowNull: false},
    group: {type: Sequelize.STRING, allowNull:false},
    content: {type: Sequelize.TEXT, allowNull: false},
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {sequelize, modelName: "wikipage"});



User.hasMany(WikiPage);
WikiPage.belongsTo(User);
