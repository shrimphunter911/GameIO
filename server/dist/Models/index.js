"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const sequelize_1 = require("sequelize");
const config = {
    host: "localhost",
    dialect: "postgres",
    port: 5432,
};
const sequelize = new sequelize_1.Sequelize("gameio", "postgres", "bracU3076", config);
const db = {
    sequelize,
    Sequelize: sequelize_1.Sequelize,
};
const files = fs.readdirSync(__dirname);
for (const file of files) {
    if (file !== "index.js") {
        const model = require(path.join(__dirname, file))(sequelize, sequelize_1.DataTypes);
        db[model.name] = model;
    }
}
Object.keys(db).forEach((modelName) => {
    const model = db[modelName];
    if (model.associate) {
        model.associate(db);
    }
});
db.sequelize = sequelize;
db.Sequelize = sequelize_1.Sequelize;
exports.default = db;
