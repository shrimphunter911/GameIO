import { login } from "../Controllers/userController";

const express = require("express");
const router = express.Router();

router.post("/", login);

export default router;
