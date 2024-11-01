import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

export interface RatingInterface extends Model {
  id: number;
  rated: number;
  review: string;
}

module.exports = (sequelize: Sequelize) => {
  const rating = sequelize.define<RatingInterface>("rating", {
    rated: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    review: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }) as ModelStatic<RatingInterface> & {
    associate: (db: DB) => void;
  };

  rating.associate = (db) => {
    (db.rating as ModelStatic<ModelWithAssociations>).belongsTo(
      db.user as ModelStatic<ModelWithAssociations>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );

    (db.rating as ModelStatic<ModelWithAssociations>).belongsTo(
      db.game as ModelStatic<ModelWithAssociations>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
  };

  return rating;
};
