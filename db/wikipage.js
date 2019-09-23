import {Model} from "sequelize";
import Sequelize from "sequelize";
import sequelize from "./connection";
import User from "./user"

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
