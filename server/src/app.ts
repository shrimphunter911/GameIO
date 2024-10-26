import express from "express";
import cors from "cors";
import db from "./Models";
const app = express();
const hostname = "127.0.0.1";
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, hostname, async () => {
  if ("sequelize" in db) {
    await db.sequelize.sync();
    console.log(`Server running at http://${hostname}:${port}/`);
  } else {
    console.error("Sequelize instance not found in db object.");
  }
});
