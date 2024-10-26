import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

interface GenreInterface extends Model {
  name: string;
}

module.exports = (sequelize: Sequelize) => {
  const genre = sequelize.define<GenreInterface>("genre", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 10],
      },
    },
  }) as ModelStatic<GenreInterface> & {
    associate: (db: DB) => void;
  };

  genre.associate = (db) => {
    (db.genre as ModelStatic<GenreInterface>).belongsToMany(
      db.game as ModelStatic<Model>,
      {
        through: "game_genres",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      }
    );
  };

  return genre;
};
