"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../Controllers/userController");
const auth = require("../Middlewares/auth");
const express = require("express");
const router = express.Router();
router.post("/", userController_1.signup);
router.get("/", auth, userController_1.getUser);
exports.default = router;
