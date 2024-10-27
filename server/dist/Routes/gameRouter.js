"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const gameController_1 = require("../Controllers/gameController");
const auth = require("../Middlewares/auth");
const express = require("express");
const router = express.Router();
router.post("/", auth, gameController_1.createGame);
exports.default = router;
