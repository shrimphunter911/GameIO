"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const genre = sequelize.define("genre", {
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 10],
            },
        },
    });
    genre.associate = (db) => {
        db.genre.hasMany(db.game_genres);
    };
    return genre;
};
