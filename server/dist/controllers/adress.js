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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adressController = void 0;
const departa_1 = require("../models/departa");
const provinc_1 = require("../models/provinc");
const distrito_1 = require("../models/distrito");
class AdressController {
    /** Trae los departamentos de la base de datos */
    getDeparta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const departamentos = yield departa_1.Gdeparta.findAll({
                attributes: [['nomdep', 'label'], ['coddep', 'value']]
            });
            res.json(departamentos);
        });
    }
    /** Trae las provincias segun el departamento */
    getProvincia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coddep } = req.params;
            console.log(coddep);
            const provincias = yield provinc_1.Gprovinc.findAll({
                attributes: [['nomprv', 'label'], ['codprv', 'value']],
                where: {
                    coddep
                }
            });
            res.json(provincias);
        });
    }
    /** Trae los distritos segun departamento y provincia */
    getDistrito(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coddep, codprv } = req.params;
            const distritos = yield distrito_1.Gdistrit.findAll({
                attributes: [['nomdis', 'label'], ['coddis', 'value']],
                where: {
                    coddep,
                    codprv
                }
            });
            res.json(distritos);
        });
    }
}
exports.adressController = new AdressController();
