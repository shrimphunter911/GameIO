"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize) => {
    const rating = sequelize.define("rating", {
        rated: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
    });
    rating.associate = (db) => {
        db.rating.belongsTo(db.user, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.rating.belongsTo(db.game, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
    };
    return rating;
};
