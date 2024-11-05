import { Request, Response } from "express";
import db, { ModelWithAssociations } from "../Models";
import { col, fn, literal, ModelStatic, Op } from "sequelize";
import _ from "lodash";
import { GameInterface } from "../Models/game";
import { GameGanresInterface } from "../Models/game_genres";
import client from "../config/elasticSearch";

const gameModel = db.game as ModelStatic<GameInterface>;
const game_genresModel = db.game_genres as ModelStatic<GameGanresInterface>;
const genreModel = db.genre as ModelStatic<ModelWithAssociations>;
const ratingModel = db.rating as ModelStatic<ModelWithAssociations>;
const userModel = db.rating as ModelStatic<ModelWithAssociations>;

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

    let givenGenres = req.body.genreIds;

    if (givenGenres.length === 0) {
      return res.status(400).send("No genre given");
    }

    const gameGenres = givenGenres.map((genreId: any) => ({
      gameId: game.dataValues.id,
      genreId: genreId,
    }));

    await game_genresModel.bulkCreate(gameGenres);

    // Indexing games in elastic
    await client.index({
      index: "games",
      id: `${game.id}`,
      body: {
        title: game.title,
        releaseDate: game.releaseDate,
        publisher: game.publisher,
        imageUrl: game.imageUrl,
        userId: game.userId,
        avg_rating: 0.0,
        genreIds: req.body.genreIds,
      },
    });

    res.status(201).json({
      ..._.omit(game.dataValues, ["userId"]),
      genreIds: givenGenres,
    });
  } catch (error) {
    res.status(404).send(error);
  }
};

export const getGames = async (req: Request, res: Response) => {
  const userId = req.user ? req.user.id : null;
  try {
    const page = parseInt(req.query.page as string) - 1 || 0;
    const limit = parseInt(req.query.limit as string) || 12;
    const offset = page * limit;
    const genreId = req.query.genreId
      ? parseInt(req.query.genreId as string)
      : undefined;
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
        : null;

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

    if (userId) {
      whereConditions.userId = userId;
    }

    const games = await gameModel.findAll({
      where: whereConditions,
      attributes: [
        "id",
        "title",
        "description",
        "releaseDate",
        "publisher",
        "imageUrl",
        [literal("ROUND(COALESCE(AVG(ratings.rated), 0), 2)"), "avg_rating"],
        [
          literal(`(
            SELECT ARRAY_AGG("genreId")
            FROM "game_genres" AS "game_genres"
            WHERE "game_genres"."gameId" = "game"."id"
          )`),
          "genreIds",
        ],
      ],
      include: [
        {
          model: ratingModel,
          attributes: [],
        },
        {
          model: game_genresModel,
          required: true,
          attributes: [],
          include: [
            {
              model: genreModel,
              where: genreId ? { id: genreId } : undefined,
              attributes: [],
            },
          ],
        },
      ],
      group: ["game.id"],
      ...(sortByRating && {
        order: [
          [literal("ROUND(COALESCE(AVG(ratings.rated), 0), 2)"), sortByRating],
        ],
      }),
      limit,
      subQuery: false,
      offset,
    });

    res.status(200).json(games);
  } catch (error) {
    res.status(404).send(error);
  }
};

export const updateGame = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const game = await gameModel.findByPk(gameId);

    if (!game) {
      return res.status(404).send("Game not found");
    }

    if (game.userId !== req.user.id) {
      return res.status(403).send("You are not authorized to update this game");
    }

    if (req.body.title && req.body.title !== game.title) {
      const existingGame = await gameModel.findOne({
        where: { title: req.body.title },
      });
      if (existingGame) {
        return res.status(400).send("Game with the same title already exists");
      }
    }

    const updatedGame = await game.update({
      title: req.body.title || game.title,
      description: req.body.description || game.description,
      releaseDate: req.body.releaseDate
        ? new Date(req.body.releaseDate).toISOString()
        : game.releaseDate,
      publisher: req.body.publisher || game.publisher,
      imageUrl: req.body.imageUrl || game.imageUrl,
    });

    res.status(201).json({
      ..._.omit(updatedGame.dataValues, ["userId"]),
      genreIds: req.body.genreIds,
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

export const getGame = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;
    const game = await gameModel.findByPk(gameId, {
      attributes: [
        "id",
        "title",
        "description",
        "releaseDate",
        "publisher",
        "imageUrl",
        [fn("AVG", col("ratings.rated")), "avg_rating"],
        [
          literal(`(
            SELECT JSON_AGG(
              JSON_BUILD_OBJECT(
                'name', users.name,
                'id', ratings.id,
                'review', ratings.review,
                'rated', ratings.rated,
                'createdAt', ratings."createdAt"
              )
            )
            FROM ratings
            INNER JOIN users ON ratings."userId" = users.id
            WHERE ratings."gameId" = ${gameId}
          )`),
          "reviews",
        ],
      ],
      include: [
        {
          model: ratingModel,
          attributes: [],
        },
      ],
      group: ["game.id"],
    });

    if (!game) {
      return res.status(404).send("Game not found");
    }

    const genres = await game_genresModel.findAll({
      where: {
        gameId: gameId,
      },
    });

    const genreIds = genres.map((genre) => genre.genreId);

    res.status(200).json({
      ..._.omit(game.dataValues, ["userId"]),
      genreIds,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteGame = async (req: Request, res: Response) => {
  try {
    const gameId = req.params.id;

    const game = await gameModel.findByPk(gameId);

    if (!game) {
      return res.status(404).send("Game not found");
    }

    if (game.userId !== req.user.id) {
      return res.status(403).send("You are not authorized to update this game");
    }

    game_genresModel.destroy({
      where: {
        gameId: gameId,
      },
    });

    ratingModel.destroy({
      where: {
        gameId: gameId,
      },
    });

    game.destroy();
    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};
