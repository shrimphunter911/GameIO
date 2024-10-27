import express from "express";
import cors from "cors";
import db from "./Models";
const config = require("config");
const app = express();
const hostname = "127.0.0.1";
const port = 3000;
import users from "./Routes/userRouter";
import auth from "./Routes/authRouter";
import games from "./Routes/gameRouter";

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

app.listen(port, hostname, async () => {
  if ("sequelize" in db) {
    await db.sequelize.sync();
    console.log(`Server running at http://${hostname}:${port}/`);
  } else {
    console.error("Sequelize instance not found in db object.");
  }
});
