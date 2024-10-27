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
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        },
    });
    game.associate = (db) => {
        db.game.belongsTo(db.user, {
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.game.belongsToMany(db.user, {
            through: db.rating,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
        db.game.belongsToMany(db.genre, {
            through: "game_genres",
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        });
    };
    return game;
};
