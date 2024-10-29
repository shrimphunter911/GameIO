import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

export interface GameGanresInterface extends ModelWithAssociations {
  genreId: number;
}

module.exports = (sequelize: Sequelize) => {
  const game_genres = sequelize.define<GameGanresInterface>(
    "game_genres",
    {}
  ) as ModelStatic<GameGanresInterface> & {
    associate: (db: DB) => void;
  };

  game_genres.associate = (db) => {
    (db.game_genres as ModelStatic<ModelWithAssociations>).belongsTo(
      db.genre as ModelStatic<ModelWithAssociations>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.game_genres as ModelStatic<ModelWithAssociations>).belongsTo(
      db.game as ModelStatic<ModelWithAssociations>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return game_genres;
};
