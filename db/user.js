import {Model} from "sequelize";
import Sequelize from "sequelize";
import sequelize from "./connection";
import bcrypt from "bcryptjs"
class User extends Model{
    generatePassword(password){
        return bcrypt.hash(password, bcrypt.genSaltSync(8));
    }
    validatePassword(password) {
        return bcrypt.compare(password, this.password);
    }
}

User.init( {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: { type: Sequelize.STRING, allowNull: false},
    password: { type: Sequelize.STRING, allowNull: false},
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
}, {sequelize, modelName: "user"});



export default User;
