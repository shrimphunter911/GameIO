"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const user = sequelize.define("user", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50],
            },
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [8, 100],
            },
        },
    });
    user.associate = (db) => {
        db.user.hasMany(db.game);
        db.user.belongsToMany(db.game, {
            through: db.rating,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };
    return user;
};
