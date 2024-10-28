"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const game = sequelize.define("game", {
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                len: [3, 50],
            },
        },
        description: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 255],
            },
        },
        releaseDate: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
        },
        publisher: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 50],
            },
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING,
        },
    });
    game.associate = (db) => {
        db.game.belongsTo(db.user, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.game.hasMany(db.rating);
        db.game.hasMany(db.game_genres);
    };
    return game;
};
