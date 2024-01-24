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
exports.terceroController = void 0;
const sequelize_1 = require("sequelize");
const ctercero_1 = require("../models/ctercero");
class TerceroController {
    newTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo, nombre, nomaux, ciftyp, cif } = req.body;
            let m_tcif = 'DNI';
            // Validamos si el tercero existe en la base de datos por el cif
            const m_exist = yield ctercero_1.Ctercero.findOne({ where: { cif: cif } });
            // Confirmamos que tipo de cif es
            if (ciftyp == '1')
                m_tcif = 'RUC';
            if (ciftyp == '2')
                m_tcif = 'Canet de extrangería';
            if (m_exist) {
                return res.status(400).json({
                    msg: `Ya existe un registro con este ${m_tcif}.`
                });
            }
            try {
                //Guardamos al tercer en la base de datos
                yield ctercero_1.Ctercero.create({
                    codigo: codigo,
                    nombre: nombre,
                    nomaux: nomaux,
                    ciftyp: ciftyp,
                    cif: cif
                });
                res.json({
                    msg: `El  registro se creó exitosamente`
                });
            }
            catch (error) {
                res.status(400).json({
                    msg: 'Upps ocurrio un error',
                    error
                });
            }
        });
    }
    getCodTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Traemos los parametros que vienen desde la URL
            const { cod } = req.params;
            // Se realiza la consutla SQL para poder generar el código que necesitamos
            const codTercero = yield ctercero_1.Ctercero.findOne({
                attributes: {
                    include: [
                        [
                            sequelize_1.Sequelize.literal(`(
                            SELECT '${cod}' || LPAD(CAST(CAST(SUBSTRING(codigo FROM 2 FOR 4) AS INTEGER) + 1 AS VARCHAR), 4, '0')
                            FROM ctercero
                            WHERE codigo = (SELECT MAX(codigo) FROM ctercero WHERE codigo LIKE '${cod}____')
                        )`), 'getCodigo'
                        ]
                    ]
                }
            });
            let codigo = codTercero === null || codTercero === void 0 ? void 0 : codTercero.dataValues.getCodigo;
            // Condiciamos si el código aun no existe
            if (!codigo)
                codigo = `${cod}0001`;
            // Retornamos una respuesta
            res.json(codigo);
        });
    }
}
exports.terceroController = new TerceroController();
