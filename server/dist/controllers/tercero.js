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
const cterdire_1 = require("../models/cterdire");
const connection_1 = __importDefault(require("../db/connection"));
/** Función para generar el código del tercero */
function generateCodigoTercero(cod) {
    return __awaiter(this, void 0, void 0, function* () {
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
        if (!codigo)
            codigo = `${cod}0001`;
        return codigo;
    });
}
class TerceroController {
    constructor() {
    }
    /** Método para generar el tercero por medio de API */
    calculateCodTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cod } = req.params;
                const codigo = yield generateCodigoTercero(cod);
                res.json(codigo);
            }
            catch (error) {
                res.status(500).json({
                    msg: 'Error al calcular el código del tercero',
                    error
                });
            }
        });
    }
    /** Nuevo tercero */
    newTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { terType, nombre, nomaux, ciftyp, cif, coment, estado, tipdir, direcc, coddep, codprv, coddis, telef1, email, contac } = req.body;
            console.log(terType, 'terType');
            let mCif = null;
            let mErr = null;
            switch (ciftyp) {
                case '0':
                    if (cif.length != 11)
                        mErr = 'El RUC debe tener 11 caracteres.';
                    mCif = 'RUC';
                    break;
                case '1':
                    if (cif.length != 8)
                        mErr = 'El DNI debe tener 8 caracteres.';
                    mCif = 'DNI';
                    break;
                case '2':
                    if (cif.length != 12)
                        mErr = 'La canet de extrangería debe tener 12 caracteres.';
                    mCif = 'Canet de extrangería';
                    break;
            }
            // Validamos si el tercero existe en la base de datos por el cif
            const mExist = yield ctercero_1.Ctercero.findOne({ where: { cif: cif } });
            if (mExist || mErr) {
                return res.status(400).json({
                    msg: mErr || `Ya existe un registro con este ${mCif}.`
                });
            }
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                /** Volvemos a calcular el código del tercero */
                let codigo = yield generateCodigoTercero(terType);
                /** Guardamos la información del tercero */
                const data = yield ctercero_1.Ctercero.create({
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
                    msg: `El  registro se creó exitosamente`,
                    data
                });
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones realizadas en la transacción */
                yield transaction.rollback();
                console.log(error);
                /** Retornamos un error controlado */
                res.status(400).json({
                    msg: 'Upps ocurrio un error123',
                    error
                });
            }
        });
    }
    /** Lista de terceros */
    getTerceros(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tercero = yield ctercero_1.Ctercero.findAll({
                attributes: ['seqno', 'codigo', 'nombre',
                    'nomaux', 'ciftyp', 'cif',
                    'estado', 'coment'],
                order: [['seqno', 'DESC']]
            });
            res.json(tercero);
        });
    }
    /** Trae un tercero */
    getOneTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { seqno } = req.params;
            const tercero = yield ctercero_1.Ctercero.findOne({
                where: { seqno }
            });
            res.json(tercero);
        });
    }
    /** Edita un tercero */
    editTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { seqno } = req.params;
            const { codigo, nombre, nomaux, ciftyp, cif, coment, estado } = req.body;
            const tercero = yield ctercero_1.Ctercero.update({
                codigo, nombre, nomaux, ciftyp, cif, coment, estado
            }, {
                where: { seqno }
            });
            res.json({
                msg: 'El registro se actualizó exitosamente'
            });
        });
    }
    /** Elimina un tercero */
    deleteTercero(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigo } = req.params;
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                /** Eliminación del tercero */
                const tercero = yield ctercero_1.Ctercero.destroy({
                    where: { codigo }
                });
                /** Eliminación de la dirección del tercero */
                const direcciones = yield cterdire_1.Cterdire.destroy({
                    where: { codigo }
                });
                /** Si todo va bien, confirmamos la transacción */
                yield transaction.commit();
                res.json({
                    msg: 'El registro a sido eliminado'
                });
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones */
                yield transaction.rollback();
                /** Retornamos un error controlado */
                res.status(400).json({
                    msg: 'Upps ocurrio un error',
                    error
                });
            }
        });
    }
}
exports.terceroController = new TerceroController();
