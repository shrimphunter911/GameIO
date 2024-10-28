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

  rating.associate = (db) => {
    (db.rating as ModelStatic<ModelWithAssociations>).belongsTo(
      db.user as ModelStatic<ModelWithAssociations>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.rating as ModelStatic<ModelWithAssociations>).belongsTo(
      db.game as ModelStatic<ModelWithAssociations>,
      {
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return rating;
};