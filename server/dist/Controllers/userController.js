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
exports.login = exports.getUser = exports.signup = void 0;
const index_1 = __importDefault(require("../Models/index"));
const lodash_1 = __importDefault(require("lodash"));
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = index_1.default.user;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel.findOne({ where: { email: req.body.email } });
        if (user)
            return res.status(400).send("User already registered");
        let reqBody = lodash_1.default.pick(req.body, ["name", "email", "password"]);
        const salt = yield bcrypt.genSalt(10);
        reqBody.password = yield bcrypt.hash(reqBody.password, salt);
        user = yield userModel.create(reqBody);
        const token = jwt.sign({ id: user.get("id") }, config.get("jwtPrivateKey"));
        res
            .header("x-auth-token", token)
            .status(200)
            .json(lodash_1.default.pick(user, ["name", "email"]));
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.signup = signup;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let id = req.user.id;
        let user = yield userModel.findByPk(id);
        if (!user)
            return res.status(404).send("User not found");
        res.status(200).json(lodash_1.default.pick(user, ["name", "email"]));
    }
    catch (error) {
        res.status(404).send(error);
    }
});
exports.getUser = getUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel.findOne({ where: { email: req.body.email } });
        if (!user)
            return res.status(400).send("Invalid email or Password");
        const validPassword = yield bcrypt.compare(req.body.password, user.get("password"));
        if (!validPassword) {
            return res.status(400).send("Invalid email or Password");
        }
        const token = jwt.sign({ id: user.get("id") }, config.get("jwtPrivateKey"));
        res.status(200).send(token);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
exports.login = login;
