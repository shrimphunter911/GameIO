import { Request, Response } from "express";
import db from "../Models";
import { Model, ModelStatic } from "sequelize";
import _ from "lodash";
import { GenreInterface } from "../Models/genre";

const gameModel = db.game as ModelStatic<Model>;
const game_genresModel = db.game_genres as ModelStatic<Model>;

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

    let givenGenres = req.body.genres;

    if (givenGenres.length === 0) {
      return res.status(400).send("No genre given");
    }

    const gameGenres = givenGenres.map((genreId: any) => ({
      gameId: game.dataValues.id,
      genreId: genreId,
    }));

    await game_genresModel.bulkCreate(gameGenres);

    res.status(201).json({
      ..._.omit(game.dataValues, ["userId"]),
      genres: givenGenres,
    });
  } catch (error) {
    res.status(404).send(error);
  }
};
