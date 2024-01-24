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
exports.loginUser = exports.newUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_code, user_name, user_password, user_email } = req.body;
    //Validamos si el usuario ya existe en la base de datos
    const exist_user = yield user_1.User.findOne({ where: { user_code: user_code } });
    if (exist_user) {
        return res.status(400).json({
            msg: `El usuario ${user_name} ya existe.`
        });
    }
    const hasedPassword = yield bcrypt_1.default.hash(user_password, 10);
    try {
        //Guardamos usuario en la base de datos
        yield user_1.User.create({
            user_code: user_code,
            user_name: user_name,
            user_password: hasedPassword,
            user_email: user_email
        });
        res.json({
            msg: `Usuario ${user_name} creado exitosamente.`
        });
    }
    catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        });
    }
});
exports.newUser = newUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_code, user_name, user_password, user_email } = req.body;
    //Validamos si el usuario existe en la base de datos
    const exist_user = yield user_1.User.findOne({ where: { user_name: user_name } });
    if (!exist_user) {
        return res.status(400).json({
            msg: `El usuario ${user_name} no existe en la base de datos`
        });
    }
    //Validamos el password
    const passwordValid = yield bcrypt_1.default.compare(user_password, exist_user.user_password);
    if (!passwordValid) {
        return res.status(400).json({
            msg: `Contraseña incorrecto`
        });
    }
    //Generamos token
    const token = jsonwebtoken_1.default.sign({
        user_name: user_name
    }, process.env.SECRET_KEY || 'pepito123'
    //,{ expiresIn: '10000'}
    );
    res.json(token);
});
exports.loginUser = loginUser;
