import { Sequelize, DataTypes, Model, ModelStatic } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

export interface GameInterface extends ModelWithAssociations {
  id: number;
  title: string;
  description: string;
  releaseDate: Date;
  publisher: string;
  imageUrl: string;
  userId: number;
}

module.exports = (sequelize: Sequelize) => {
  const game = sequelize.define<GameInterface>("game", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
  }) as ModelStatic<GameInterface> & {
    associate: (db: DB) => void;
  };

  game.associate = (db) => {
    (db.game as ModelStatic<ModelWithAssociations>).belongsTo(
      db.user as ModelStatic<ModelWithAssociations>,
      {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        foreignKey: { allowNull: false },
      }
    );
    (db.game as ModelStatic<ModelWithAssociations>).hasMany(
      db.rating as ModelStatic<Model>
    );
    (db.game as ModelStatic<ModelWithAssociations>).hasMany(
      db.game_genres as ModelStatic<Model>
    );
  };

  return game;
};
