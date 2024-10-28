import { Request, Response } from "express";
import db, { ModelWithAssociations } from "../Models";
import { col, fn, ModelStatic, Op } from "sequelize";
import _ from "lodash";

const gameModel = db.game as ModelStatic<ModelWithAssociations>;
const game_genresModel = db.game_genres as ModelStatic<ModelWithAssociations>;
const ratingModel = db.rating as ModelStatic<ModelWithAssociations>;

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

export const getGames = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) - 1 || 0;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = page * limit;

    const search = req.query.search ? (req.query.search as string) : "";
    const publisher = req.query.publisher
      ? (req.query.publisher as string)
      : "";
    const releaseYear = req.query.releaseDate
      ? parseInt(req.query.releaseDate as string)
      : undefined;
    const sortByRating =
      req.query.sortByRating === "asc" || req.query.sortByRating === "desc"
        ? req.query.sortByRating
        : "asc";

    const releaseDateRange = releaseYear
      ? {
          [Op.between]: [
            new Date(releaseYear, 0, 1).toISOString(),
            new Date(releaseYear, 11, 31, 23, 59, 59).toISOString(),
          ],
        }
      : undefined;

    const whereConditions: any = {
      title: {
        [Op.iLike]: `%${search}%`,
      },
      ...(releaseDateRange && { releaseDate: releaseDateRange }),
      ...(publisher && { publisher: { [Op.iLike]: `%${publisher}%` } }),
    };

    const games = await gameModel.findAll({
      attributes: ["title", [fn("AVG", col("ratings.rated")), "avg_rating"]],
      include: [
        {
          model: ratingModel,
          attributes: [],
        },
      ],
      group: ["game.id"],
    });

    res.status(200).json(games);
  } catch (error) {
    res.status(404).send(error);
  }
};