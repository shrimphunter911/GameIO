"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGame = exports.getGame = exports.updateGame = exports.getGames = exports.createGame = void 0;
const Models_1 = __importDefault(require("../Models"));
const sequelize_1 = require("sequelize");
const lodash_1 = __importDefault(require("lodash"));
const gameModel = Models_1.default.game;
const game_genresModel = Models_1.default.game_genres;
const genreModel = Models_1.default.genre;
const ratingModel = Models_1.default.rating;
const userModel = Models_1.default.rating;
const createGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let games = yield gameModel.findAll({ where: { title: req.body.title } });
        if (games.length !== 0)
            return res.status(400).send("Game with the same title already exists");
        let userId = req.user.id;
        let date = new Date(req.body.releaseDate);
        let game = yield gameModel.create({
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
        const gameGenres = givenGenres.map((genreId) => ({
            gameId: game.dataValues.id,
            genreId: genreId,
        }));
        yield game_genresModel.bulkCreate(gameGenres);
        res.status(201).json(Object.assign(Object.assign({}, lodash_1.default.omit(game.dataValues, ["userId"])), { genreIds: givenGenres }));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.createGame = createGame;
const getGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user ? req.user.id : null;
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 12;
        const offset = page * limit;
        const genreId = req.query.genreId
            ? parseInt(req.query.genreId)
            : undefined;
        const search = req.query.search ? req.query.search : "";
        const publisher = req.query.publisher
            ? req.query.publisher
            : "";
        const releaseYear = req.query.releaseDate
            ? parseInt(req.query.releaseDate)
            : undefined;
        const sortByRating = req.query.sortByRating === "asc" || req.query.sortByRating === "desc"
            ? req.query.sortByRating
            : null;
        const releaseDateRange = releaseYear
            ? {
                [sequelize_1.Op.between]: [
                    new Date(releaseYear, 0, 1).toISOString(),
                    new Date(releaseYear, 11, 31, 23, 59, 59).toISOString(),
                ],
            }
            : undefined;
        const whereConditions = Object.assign(Object.assign({ title: {
                [sequelize_1.Op.iLike]: `%${search}%`,
            } }, (releaseDateRange && { releaseDate: releaseDateRange })), (publisher && { publisher: { [sequelize_1.Op.iLike]: `%${publisher}%` } }));
        if (userId) {
            whereConditions.userId = userId;
        }
        const games = yield gameModel.findAll(Object.assign(Object.assign({ where: whereConditions, attributes: [
                "id",
                "title",
                "description",
                "releaseDate",
                "publisher",
                "imageUrl",
                [(0, sequelize_1.literal)("ROUND(COALESCE(AVG(ratings.rated), 0), 2)"), "avg_rating"],
                [
                    (0, sequelize_1.literal)(`(
            SELECT ARRAY_AGG("genreId")
            FROM "game_genres" AS "game_genres"
            WHERE "game_genres"."gameId" = "game"."id"
          )`),
                    "genreIds",
                ],
            ], include: [
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
            ], group: ["game.id"] }, (sortByRating && {
            order: [
                [(0, sequelize_1.literal)("ROUND(COALESCE(AVG(ratings.rated), 0), 2)"), sortByRating],
            ],
        })), { limit, subQuery: false, offset }));
        res.status(200).json(games);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getGames = getGames;
const updateGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const game = yield gameModel.findByPk(gameId);
        if (!game) {
            return res.status(404).send("Game not found");
        }
        if (game.userId !== req.user.id) {
            return res.status(403).send("You are not authorized to update this game");
        }
        if (req.body.title && req.body.title !== game.title) {
            const existingGame = yield gameModel.findOne({
                where: { title: req.body.title },
            });
            if (existingGame) {
                return res.status(400).send("Game with the same title already exists");
            }
        }
        const updatedGame = yield game.update({
            title: req.body.title || game.title,
            description: req.body.description || game.description,
            releaseDate: req.body.releaseDate
                ? new Date(req.body.releaseDate).toISOString()
                : game.releaseDate,
            publisher: req.body.publisher || game.publisher,
            imageUrl: req.body.imageUrl || game.imageUrl,
        });
        res.status(201).json(Object.assign(Object.assign({}, lodash_1.default.omit(updatedGame.dataValues, ["userId"])), { genreIds: req.body.genreIds }));
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.updateGame = updateGame;
const getGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        let game = yield gameModel.findOne({
            where: { id: gameId },
            attributes: [
                "id",
                "title",
                "description",
                "releaseDate",
                "publisher",
                "imageUrl",
                [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("ratings.rated")), "avg_rating"],
                [
                    (0, sequelize_1.literal)(`(
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
        let genres = yield game_genresModel.findAll({
            where: {
                gameId: gameId,
            },
        });
        let genreIds = genres.map((genre) => genre.genreId);
        res.status(200).json(Object.assign(Object.assign({}, lodash_1.default.omit(game.dataValues, ["userId"])), { genreIds }));
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.getGame = getGame;
const deleteGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const game = yield gameModel.findByPk(gameId);
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
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.deleteGame = deleteGame;
