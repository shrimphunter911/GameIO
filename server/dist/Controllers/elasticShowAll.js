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
exports.getAllGamesFromElastic = void 0;
const elasticSearch_1 = __importDefault(require("../config/elasticSearch"));
const getAllGamesFromElastic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield elasticSearch_1.default.search({
            index: "games",
            body: {
                query: {
                    match_all: {},
                },
            },
            size: 10000,
        });
        const games = result.hits.hits.map((hit) => (Object.assign({ id: hit._id }, hit._source)));
        res.status(200).json(games);
    }
    catch (error) {
        res.status(500).send({ error: "Failed to fetch games from Elasticsearch" });
    }
});
exports.getAllGamesFromElastic = getAllGamesFromElastic;
