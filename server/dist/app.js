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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Models_1 = __importDefault(require("./Models"));
const elasticSearchSetup_1 = __importDefault(require("./elasticSearchSetup"));
const config = require("config");
const app = (0, express_1.default)();
const hostname = "127.0.0.1";
const port = 3000;
const userRouter_1 = __importDefault(require("./Routes/userRouter"));
const authRouter_1 = __importDefault(require("./Routes/authRouter"));
const gameRouter_1 = __importDefault(require("./Routes/gameRouter"));
const elasticShowAll_1 = require("./Controllers/elasticShowAll");
if (!config.get("jwtPrivateKey")) {
    console.log("Fatal Error: jwtPrivateKey is not defined");
    process.exit(1);
}
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/users", userRouter_1.default);
app.use("/api/auth", authRouter_1.default);
app.use("/api/games", gameRouter_1.default);
app.use("/api/elastic", elasticShowAll_1.getAllGamesFromElastic);
app.listen(port, hostname, () => __awaiter(void 0, void 0, void 0, function* () {
    if ("sequelize" in Models_1.default) {
        yield Models_1.default.sequelize.sync();
        try {
            yield (0, elasticSearchSetup_1.default)();
        }
        catch (err) {
            console.log(err);
        }
        console.log(`Server running at http://${hostname}:${port}/`);
    }
    else {
        console.error("Sequelize instance not found in db object.");
    }
}));
