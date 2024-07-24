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
exports.queryBasicController = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const ctercero_1 = require("../models/ctercero");
class QueryBasicController {
    deleteOneRow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [strTable, objCondition] = req.body;
            /** Mapeo de nombres de tablas a modelos */
            const modelMap = {
                'Ctercero': ctercero_1.Ctercero
            };
            const ModelToUse = modelMap[strTable];
            if (!ModelToUse) {
                return res.status(400).json({
                    msg: 'Modelo no encontrado para la tabla especificada',
                });
            }
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                yield ModelToUse.destroy({
                    where: objCondition,
                    force: true,
                    transaction: transaction
                });
                /** Si todo va bien, confirmamos la transacción */
                yield transaction.commit();
                res.json('El registro a sido eliminado');
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones */
                yield transaction.rollback();
                console.log(error);
                /** Retornamos un error controlado */
                res.status(400).json({
                    msg: 'Upps ocurrio un error',
                    error: error
                });
            }
        });
    }
}
exports.queryBasicController = new QueryBasicController();
