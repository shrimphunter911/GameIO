import express from "express";
import cors from "cors";
import db from "./Models";
import createGameIndex from "./elasticSearchSetup";
const config = require("config");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;
import users from "./Routes/userRouter";
import auth from "./Routes/authRouter";
import games from "./Routes/gameRouter";
import { getAllGamesFromElastic } from "./Controllers/elasticShowAll";

if (!config.get("jwtPrivateKey")) {
  console.log("Fatal Error: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/games", games);
app.use("/api/elastic", getAllGamesFromElastic);

app.listen(port, hostname, async () => {
  if ("sequelize" in db) {
    await db.sequelize.sync();
    // Elastic indexing
    // try {
    //   await createGameIndex();
    // } catch (err: any) {
    //   console.log(err);
    // }
    console.log(`Server running at http://${hostname}:${port}/`);
  } else {
    console.error("Sequelize instance not found in db object.");
  }
});
