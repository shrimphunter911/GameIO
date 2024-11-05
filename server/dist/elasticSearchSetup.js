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
const elasticSearch_1 = __importDefault(require("./config/elasticSearch"));
const createGameIndex = () => __awaiter(void 0, void 0, void 0, function* () {
    const index = "games";
    const exists = yield elasticSearch_1.default.indices.exists({ index });
    if (!exists) {
        yield elasticSearch_1.default.indices.create({
            index,
            body: {
                mappings: {
                    properties: {
                        title: { type: "text" },
                        releaseDate: { type: "date" },
                        publisher: { type: "text" },
                        imageUrl: { type: "text" },
                        userId: { type: "integer" },
                        avg_rating: { type: "double" },
                        genreIds: { type: "integer" },
                    },
                },
            },
        });
        console.log(`Index "${index}" created.`);
    }
    else {
        console.log(`Index "${index}" already exists.`);
    }
});
exports.default = createGameIndex;
