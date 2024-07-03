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
exports.cterdireController = void 0;
const cterdire_1 = require("../models/cterdire");
const connection_1 = __importDefault(require("../db/connection"));
class CterdireController {
    /** Método para traer las direcciones de los terceros */
    getDirecciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            const direcciones = yield cterdire_1.Cterdire.findAll({
                attributes: ['codigo', 'tipdir', 'direcc', 'telef1',
                    [connection_1.default.literal(`
                CASE
                WHEN tipdir = 0 THEN 'Dirección fiscal'
                WHEN tipdir = 1 THEN 'Dirección 1'
                WHEN tipdir = 2 THEN 'Dirección 2'
                WHEN tipdir = 3 THEN 'Dirección 3'
                END
            `), 'nomdir']],
                order: [['tipdir', 'ASC']],
                where: { codigo }
            });
            // Retornamos la información de la consulta
            res.json(direcciones);
        });
    }
    getOneDireccion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo, tipdir } = req.params;
            const direccion = yield cterdire_1.Cterdire.findOne({
                where: { codigo, tipdir }
            });
            // Retornamos la información de la consulta
            res.json(direccion);
        });
    }
}
exports.cterdireController = new CterdireController();
