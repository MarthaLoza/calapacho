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
exports.terceroController = void 0;
const sequelize_1 = require("sequelize");
const ctercero_1 = require("../models/ctercero");
const connection_1 = __importDefault(require("../db/connection"));
class TerceroController {
    newTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo, nombre, nomaux, ciftyp, cif, coment, estado, tipdir, direcc, coddep, codprv, coddis, telef1, email, contac } = req.body;
            let m_tcif = 'RUC';
            // Valworkamos si el tercero existe en la base de datos por el cif
            const m_exist = yield ctercero_1.Ctercero.findOne({ where: { cif: cif } });
            // Confirmamos que tipo de cif es
            if (ciftyp == '1')
                m_tcif = 'DNI';
            if (ciftyp == '2')
                m_tcif = 'Canet de extrangería';
            if (m_exist) {
                return res.status(400).json({
                    msg: `Ya existe un registro con este ${m_tcif}.`
                });
            }
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                /** Guardamos la información del tercero */
                yield ctercero_1.Ctercero.create({
                    codigo: codigo,
                    nombre: nombre,
                    nomaux: nomaux,
                    ciftyp: ciftyp,
                    cif: cif,
                    coment: coment,
                    estado: estado
                }, { transaction });
                /** Guardamos la información de dirección */
                /* await Cterdire.create({
                    codigo  : codigo,
                    tipdir  : tipdir,
                    direcc  : direcc,
                    coddep  : coddep,
                    codprv  : codprv,
                    coddis  : coddis,
                    telef1  : telef1,
                    email   : email,
                    contac  : contac
                }, { transaction }); */
                /** Si todo va bien, confirmamos la transacción */
                yield transaction.commit();
                res.json({
                    msg: `El  registro se creó exitosamente`
                });
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones realizadas en la transacción */
                yield transaction.rollback();
                /** Retornamos un error controlado */
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
    getTerceros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tercero = yield ctercero_1.Ctercero.findAll({
                attributes: ['seqno', 'codigo', 'nombre', 'cif'],
                order: [['seqno', 'ASC']]
            });
            res.json(tercero);
        });
    }
    getOneTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { seqno } = req.params;
            const tercero = yield ctercero_1.Ctercero.findOne({
                where: { seqno }
            });
            res.json(tercero);
        });
    }
}
exports.terceroController = new TerceroController();
