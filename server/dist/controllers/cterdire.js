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
const sequelize_1 = require("sequelize");
class CterdireController {
    /** Lista de direcciones de terceros con o sin filtro */
    getDirecciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body, "BODY");
            const { codigo, tipdir, coddep, codprv, coddis, direcc, contac, telef1, email } = req.body;
            // Crear el objeto de condiciones
            const conditions = [];
            if (tipdir || tipdir == 0) {
                console.log(tipdir, "ERRORTIPDIR");
                conditions.push({ tipdir: { [sequelize_1.Op.eq]: tipdir } });
            }
            if (codigo)
                conditions.push({ codigo: { [sequelize_1.Op.like]: codigo } });
            if (coddep)
                conditions.push({ coddep: { [sequelize_1.Op.like]: coddep } });
            if (codprv)
                conditions.push({ codprv: { [sequelize_1.Op.like]: codprv } });
            if (coddis)
                conditions.push({ coddis: { [sequelize_1.Op.like]: coddis } });
            if (direcc)
                conditions.push({ direcc: { [sequelize_1.Op.like]: `%${direcc}%` } });
            if (contac)
                conditions.push({ contac: { [sequelize_1.Op.like]: `%${contac}%` } });
            if (telef1)
                conditions.push({ telef1: { [sequelize_1.Op.like]: `%${telef1}%` } });
            if (email)
                conditions.push({ email: { [sequelize_1.Op.like]: `%${email}%` } });
            // Crear la condición principal utilizando Op.and si hay condiciones, de lo contrario usar 1=1
            const condition = conditions.length > 0 ? { [sequelize_1.Op.and]: conditions } : {};
            console.log(condition, "CONDITION1");
            try {
                const tercero = yield cterdire_1.Cterdire.findAll({
                    where: condition,
                    attributes: ['codigo', 'tipdir', 'coddep', 'codprv', 'coddis', 'direcc', 'contac', 'telef1', 'email',
                        [connection_1.default.literal(`
                    CASE
                    WHEN tipdir = 0 THEN 'Dirección fiscal'
                    WHEN tipdir = 1 THEN 'Dirección 1'
                    WHEN tipdir = 2 THEN 'Dirección 2'
                    WHEN tipdir = 3 THEN 'Dirección 3'
                    END
                `), 'nomdir']],
                    order: [['tipdir', 'DESC']],
                    //where: { codigo }
                });
                res.json(tercero);
            }
            catch (error) {
                console.error(error);
                res.status(500).send('Error al obtener los terceros');
            }
        });
    }
}
exports.cterdireController = new CterdireController();
