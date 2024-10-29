import {
  createGame,
  getGame,
  getGames,
  updateGame,
} from "../Controllers/gameController";
import { getRating, postRating } from "../Controllers/ratingController";

const auth = require("../Middlewares/auth");

const express = require("express");
const router = express.Router();

router.post("/", auth, createGame);
router.get("/", getGames);
router.get("/:id", getGame);
router.put("/:id", auth, updateGame);
router.post("/:id/rating", auth, postRating);
router.get("/:id/rating", auth, getRating);

export default router;
