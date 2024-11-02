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
exports.editRating = exports.getRating = exports.postRating = void 0;
const Models_1 = __importDefault(require("../Models"));
const lodash_1 = __importDefault(require("lodash"));
const ratingModel = Models_1.default.rating;
const postRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const userId = req.user.id;
        const request = {
            gameId: gameId,
            userId: userId,
            rated: req.body.rated,
        };
        if (req.body.review) {
            request.review = req.body.review;
        }
        let rating = yield ratingModel.create(request);
        res
            .status(201)
            .json(lodash_1.default.pick(rating.dataValues, ["gameId", "rated", "review"]));
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
        res
            .status(200)
            .json(lodash_1.default.pick(rating.dataValues, ["id", "gameId", "rated", "review"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getRating = getRating;
const editRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gameId = req.params.id;
        const userId = req.user.id;
        const rating = yield ratingModel.findOne({
            where: { gameId: gameId, userId: userId },
        });
        if (!rating) {
            return res.status(400).send("Rating could not be found");
        }
        const request = {
            rated: req.body.rated || rating.rated,
            review: req.body.review || rating.review,
        };
        const updatedRating = yield rating.update(request);
        res
            .status(201)
            .json(lodash_1.default.pick(updatedRating.dataValues, ["gameId", "rated", "review"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.editRating = editRating;
