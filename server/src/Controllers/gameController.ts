import { Request, Response } from "express";
import db from "../Models";
import { Model, ModelStatic } from "sequelize";
import _ from "lodash";

const gameModel = db.game as ModelStatic<Model>;

export const createGame = async (req: Request, res: Response) => {
  try {
    let games = await gameModel.findAll({ where: { title: req.body.title } });
    if (games.length !== 0)
      return res.status(400).send("Game with the same title already exists");
    let userId = req.user.id;
    let date = new Date(req.body.releaseDate);
    let game = await gameModel.create({
      title: req.body.title,
      description: req.body.description,
      releaseDate: date.toISOString(),
      publisher: req.body.publisher,
      imageUrl: req.body.imageUrl,
      userId: userId,
    });

    res.status(201).json(_.omit(game, ["userId"]));
  } catch (error) {
    res.status(404).send(error);
  }
};
