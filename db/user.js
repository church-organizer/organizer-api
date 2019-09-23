import {Model} from "sequelize";
import Sequelize from "sequelize";
import sequelize from "./connection";
import bcrypt from "bcryptjs"
// User.generatePassword = function(){
//     return bcrypt.hash(password, bcrypt.genSaltSync(8));
// };
// User.validatePassword = function(){
//     return bcrypt.compare(password, this.password);
// };
//
// User.init( {
//     id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
//     name: { type: Sequelize.STRING, allowNull: false},
//     password: { type: Sequelize.STRING, allowNull: false},
//     createdAt: Sequelize.DATE,
//     updatedAt: Sequelize.DATE,
// }, {sequelize, modelName: "user"});

const User = sequelize.define('User', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: Sequelize.STRING, allowNull: false},
    password: { type: Sequelize.STRING, allowNull: false}
});




if(process.env.ROOT_PASSWORD){
    const password  = User.generatePassword();
    User.create({name: "hallo", password: password})
} else {
    throw new Error("Missing Env Variable");
}




export default User;
