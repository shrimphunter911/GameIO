import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

interface RatingInterface extends Model {
  rating: number;
}

module.exports = (sequelize: Sequelize) => {
  const rating = sequelize.define<RatingInterface>("rating", {
    rated: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }) as ModelStatic<RatingInterface> & {
    associate: (db: DB) => void;
  };

  return rating;
};
