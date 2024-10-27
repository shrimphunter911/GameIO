import { getUser, signup } from "../Controllers/userController";
const auth = require("../Middlewares/auth");

const express = require("express");
const router = express.Router();

router.post("/", signup);
router.get("/", auth, getUser);

export default router;
