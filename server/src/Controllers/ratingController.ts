import { Request, Response } from "express";
import db from "../Models";
import { Model, ModelStatic } from "sequelize";
import _ from "lodash";

const ratingModel = db.rating as ModelStatic<Model>;

export const postRating = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const userId = req.user.id;
    let rating = await ratingModel.create({
      gameId: gameId,
      userId: userId,
      rated: req.body.rating,
    });

    res.status(201).json(_.pick(rating.dataValues, ["gameId", "rated"]));
  } catch (error) {
    res.status(404).send(error);
  }
};

export const getRating = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const userId = req.user.id;
    let rating = await ratingModel.findOne({
      where: { userId: userId, gameId: gameId },
    });
    if (!rating) {
      return res.status(200).json({
        gameId: gameId,
      });
    }
    res.status(200).json(_.pick(rating.dataValues, ["gameId", "rated"]));
  } catch (error) {
    res.status(404).send(error);
  }
};
