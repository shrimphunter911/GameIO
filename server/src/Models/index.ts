const fs = require("fs");
const path = require("path");

import { Sequelize, DataTypes, Model, Dialect, ModelStatic } from "sequelize";

export interface ModelWithAssociations extends Model {
  associate?: (db: DB) => void;
}

export interface DB {
  [key: string]:
    | ModelStatic<Model>
    | ModelWithAssociations
    | Sequelize
    | typeof Sequelize;
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}

const config = {
  host: "localhost",
  dialect: "postgres" as Dialect,
  port: 5432,
};

const sequelize = new Sequelize("gameio2", "postgres", "bracU3076", config);
const db: DB = {
  sequelize,
  Sequelize,
};

const files = fs.readdirSync(__dirname);

for (const file of files) {
  if (file !== "index.js") {
    const model = require(path.join(__dirname, file))(
      sequelize,
      DataTypes
    ) as ModelStatic<Model> & { associate?: (db: DB) => void };
    db[model.name] = model;
  }
}

Object.keys(db).forEach((modelName) => {
  const model = db[modelName] as ModelStatic<Model> & ModelWithAssociations;
  if (model.associate) {
    model.associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
