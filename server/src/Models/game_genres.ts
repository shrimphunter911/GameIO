import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

interface GameGanres extends Model {}

module.exports = (sequelize: Sequelize) => {
  const game_genres = sequelize.define<GameGanres>(
    "game_genres",
    {}
  ) as ModelStatic<GameGanres> & {
    associate: (db: DB) => void;
  };

  game_genres.associate = (db) => {
    (db.game_genres as ModelStatic<ModelWithAssociations>).belongsTo(
      db.genre as ModelStatic<ModelWithAssociations>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.game_genres as ModelStatic<ModelWithAssociations>).belongsTo(
      db.game as ModelStatic<ModelWithAssociations>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return game_genres;
};
