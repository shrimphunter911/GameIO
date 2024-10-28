"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
module.exports = (sequelize) => {
    const game_genres = sequelize.define("game_genres", {});
    game_genres.associate = (db) => {
        db.game_genres.belongsTo(db.genre, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
        db.game_genres.belongsTo(db.game, {
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
            foreignKey: { allowNull: false },
        });
    };
    return game_genres;
};
