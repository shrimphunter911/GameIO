import { query, Request, Response } from "express";
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

interface GameForES {
  id?: string;
  releaseDate: string;
  publisher: string;
  imageUrl: string;
  userId: number;
  avg_rating: number;
  genreIds: number[];
}

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

    const elasticQuery: any = {
      index: "games",
      from: offset,
      size: limit,
      body: {
        query: {
          bool: {
            must: [
              search
                ? { match_phrase_prefix: { title: search } }
                : { match_all: {} },
              publisher
                ? { match: { publisher: publisher } }
                : { match_all: {} },
            ],
            filter: [
              ...(genreId ? [{ term: { genreIds: genreId } }] : []),
              ...(releaseYear
                ? [
                    {
                      range: {
                        releaseDate: {
                          gte: `${releaseYear}-01-01`,
                          lte: `${releaseYear}-12-31`,
                        },
                      },
                    },
                  ]
                : []),
              ...(userId ? [{ term: { userId: userId } }] : []),
            ],
          },
        },
        ...(sortByRating
          ? { sort: [{ avg_rating: { order: sortByRating } }] }
          : {}),
      },
    };

    const { hits } = await client.search(elasticQuery);

    const games = hits.hits.map((hit) => {
      const { userId, ...gameData } = hit._source as GameForES;
      return {
        ...gameData,
        id: parseInt(hit._id!),
      };
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

    await client.update({
      index: "games",
      id: gameId,
      doc: {
        title: req.body.title || game.title,
        description: req.body.description || game.description,
        releaseDate: req.body.releaseDate
          ? new Date(req.body.releaseDate).toISOString()
          : game.releaseDate,
        publisher: req.body.publisher || game.publisher,
        imageUrl: req.body.imageUrl || game.imageUrl,
      },
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

    const avg_rating = game.dataValues.avg_rating;

    if (avg_rating !== null) {
      await client.update({
        index: "games",
        id: gameId,
        doc: {
          avg_rating: parseFloat(avg_rating),
        },
      });
    }

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

    await client.delete({
      index: "games",
      id: gameId,
    });
    res.status(200).send("Successfully deleted");
  } catch (error) {
    res.status(400).send(error);
  }
};
