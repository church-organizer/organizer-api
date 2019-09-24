const Sequelize = require('sequelize');
const Model = require('sequelize').Model;
const sequelize = require('./connection');
const bcrypt = require('bcryptjs');

class User extends Model{}

User.init( {
    id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: Sequelize.STRING, allowNull: false},
    password: {type: Sequelize.STRING, allowNull: false}
}, {sequelize: sequelize, modelName: "user"});

const generateHash = (password) => {
    // hash function is async
    return bcrypt.hash(password, 10);
};

const validateHash = (user, password) => {
    return bcrypt.compare(password, user.password);
};

User.beforeCreate((user, option) => {
    return generateHash(user.password).then(hash => {
        user.password = hash;
    }).catch(err => {
        throw new Error("Error at crypting password");
    });
});


if (process.env.ADMIN_PASSWORD) {
    User.findOrCreate({
        where: {username: "admin"},
        defaults: {password: generateHash(process.env.ADMIN_PASSWORD)}
    }).then(([user, created]) => {
        if (created) {
            console.log("Es wurde ein neuer Admin User angelegt");
        } else {
            console.log("Es wurde ein bestehender Admin User gefunden.");
        }
    })
} else {
    throw new Error("Missing Env Variable ROOT_PASSWORD");
}


module.exports = User;
