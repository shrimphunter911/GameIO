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
exports.createGame = void 0;
const Models_1 = __importDefault(require("../Models"));
const lodash_1 = __importDefault(require("lodash"));
const gameModel = Models_1.default.game;
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
        res.status(201).json(lodash_1.default.omit(game, ["userId"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.createGame = createGame;
