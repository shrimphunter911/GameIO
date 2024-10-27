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

  return game_genres;
};
