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
exports.getGames = exports.createGame = void 0;
const Models_1 = __importDefault(require("../Models"));
const sequelize_1 = require("sequelize");
const lodash_1 = __importDefault(require("lodash"));
const gameModel = Models_1.default.game;
const game_genresModel = Models_1.default.game_genres;
const ratingModel = Models_1.default.rating;
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
        let givenGenres = req.body.genres;
        if (givenGenres.length === 0) {
            return res.status(400).send("No genre given");
        }
        const gameGenres = givenGenres.map((genreId) => ({
            gameId: game.dataValues.id,
            genreId: genreId,
        }));
        yield game_genresModel.bulkCreate(gameGenres);
        res.status(201).json(Object.assign(Object.assign({}, lodash_1.default.omit(game.dataValues, ["userId"])), { genres: givenGenres }));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.createGame = createGame;
const getGames = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) - 1 || 0;
        const limit = parseInt(req.query.limit) || 12;
        const offset = page * limit;
        const search = req.query.search ? req.query.search : "";
        const publisher = req.query.publisher
            ? req.query.publisher
            : "";
        const releaseYear = req.query.releaseDate
            ? parseInt(req.query.releaseDate)
            : undefined;
        const sortByRating = req.query.sortByRating === "asc" || req.query.sortByRating === "desc"
            ? req.query.sortByRating
            : "asc";
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
        const games = yield gameModel.findAll({
            attributes: ["title", [(0, sequelize_1.fn)("AVG", (0, sequelize_1.col)("ratings.rated")), "avg_rating"]],
            include: [
                {
                    model: ratingModel,
                    attributes: [],
                },
            ],
            group: ["game.id"],
        });
        res.status(200).json(games);
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getGames = getGames;
