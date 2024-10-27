import { Request, Response } from "express";
import db from "../Models/index";
import { Model, ModelStatic } from "sequelize";
import _ from "lodash";
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userModel = db.user as ModelStatic<Model>;

export const signup = async (req: Request, res: Response) => {
  try {
    let user = await userModel.findOne({ where: { email: req.body.email } });
    if (user) return res.status(400).send("User already registered");

    let reqBody = _.pick(req.body, ["name", "email", "password"]);
    const salt = await bcrypt.genSalt(10);
    reqBody.password = await bcrypt.hash(reqBody.password, salt);
    user = await userModel.create(reqBody);
    const token = jwt.sign({ id: user.get("id") }, config.get("jwtPrivateKey"));
    res
      .header("x-auth-token", token)
      .status(200)
      .json(_.pick(user, ["name", "email"]));
  } catch (error) {
    res.status(400).send(error);
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    let id = req.user.id;
    let user = await userModel.findByPk(id);
    if (!user) return res.status(404).send("User not found");
    res.status(200).json(_.pick(user, ["name", "email"]));
  } catch (error) {
    res.status(404).send(error);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    let user = await userModel.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Invalid email or Password");

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.get("password")
    );

    if (!validPassword) {
      return res.status(400).send("Invalid email or Password");
    }

    const token = jwt.sign({ id: user.get("id") }, config.get("jwtPrivateKey"));
    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
};
