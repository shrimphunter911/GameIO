import { createGame } from "../Controllers/gameController";

const auth = require("../Middlewares/auth");

const express = require("express");
const router = express.Router();

router.post("/", auth, createGame);

export default router;
