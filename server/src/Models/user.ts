import { Sequelize, DataTypes, ModelStatic, Model } from "sequelize";
import { DB, ModelWithAssociations } from "./index";

interface UserInterface extends Model {
  id: number;
  name: string;
  email: string;
  password: string;
}

module.exports = (sequelize: Sequelize) => {
  const user = sequelize.define<UserInterface>("user", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 100],
      },
    },
  }) as ModelStatic<UserInterface> & {
    associate: (db: DB) => void;
  };

  user.associate = (db: DB) => {
    (db.user as ModelStatic<ModelWithAssociations>).hasMany(
      db.game as ModelStatic<Model>
    );
    (db.user as ModelStatic<ModelWithAssociations>).hasMany(
      db.rating as ModelStatic<Model>
    );
  };

  return user;
};
