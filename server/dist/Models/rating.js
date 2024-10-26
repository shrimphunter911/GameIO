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
    return rating;
};
