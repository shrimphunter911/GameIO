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
exports.getRating = exports.postRating = void 0;
const Models_1 = __importDefault(require("../Models"));
const lodash_1 = __importDefault(require("lodash"));
const ratingModel = Models_1.default.rating;
const postRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const userId = req.user.id;
        let rating = yield ratingModel.create({
            gameId: gameId,
            userId: userId,
            rated: req.body.rating,
        });
        res.status(201).json(lodash_1.default.pick(rating.dataValues, ["gameId", "rated"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.postRating = postRating;
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const userId = req.user.id;
        let rating = yield ratingModel.findOne({
            where: { userId: userId, gameId: gameId },
        });
        if (!rating) {
            return res.status(200).json({
                gameId: gameId,
            });
        }
        res.status(200).json(lodash_1.default.pick(rating.dataValues, ["gameId", "rated"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getRating = getRating;
