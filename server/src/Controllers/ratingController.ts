import { Request, Response } from "express";
import db from "../Models";
import { Model, ModelStatic } from "sequelize";
import _ from "lodash";
import { RatingInterface } from "../Models/rating";

const ratingModel = db.rating as ModelStatic<RatingInterface>;

export const postRating = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const userId = req.user.id;
    const request: any = {
      gameId: gameId,
      userId: userId,
      rated: req.body.rated,
    };

    if (req.body.review) {
      request.review = req.body.review;
    }

    let rating = await ratingModel.create(request);

    res
      .status(201)
      .json(_.pick(rating.dataValues, ["gameId", "rated", "review"]));
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
    res
      .status(200)
      .json(_.pick(rating.dataValues, ["gameId", "rated", "review"]));
  } catch (error) {
    res.status(404).send(error);
  }
};

export const editRating = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const userId = req.user.id;
    const rating = await ratingModel.findOne({
      where: { gameId: gameId, userId: userId },
    });

    if (!rating) {
      return res.status(400).send("Rating could not be found");
    }

    const request: any = {
      rated: req.body.rated || rating.rated,
      review: req.body.review || rating.review,
    };

    const updatedRating = await rating.update(request);
    res
      .status(201)
      .json(_.pick(updatedRating.dataValues, ["gameId", "rated", "review"]));
  } catch (error) {
    res.status(404).send(error);
  }
};
