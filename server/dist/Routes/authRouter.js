"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userController_1 = require("../Controllers/userController");
const express = require("express");
const router = express.Router();
router.post("/", userController_1.login);
exports.default = router;
