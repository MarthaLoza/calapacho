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
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
const ctercero_1 = require("../models/ctercero");
const cterdire_1 = require("../models/cterdire");
class QueryBasicController {
    /**
     * Este metodo se encarga de mapear el nombre de la tabla con el modelo correspondiente
     * para poder devolver el modelo correspondiente a la tabla.
     * @param tableName     Nombre de la tabla String
     * @returns             Nombre de la tabla Modelo
     */
    static ModelTableMap(tableName) {
        const modelMap = {
            'Ctercero': ctercero_1.Ctercero,
            'Cterdire': cterdire_1.Cterdire
        };
        return modelMap[tableName] || null;
    }
    /**
     * ["strTable", { id : 1 }]
     *
     * @param strTable          Nombre de la tabla
     * @param objCondition      Condición de id para la eliminación
     * @returns
     */
    deleteOneRow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [strTable, objCondition] = req.body;
            const ModelToUse = QueryBasicController.ModelTableMap(strTable);
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
                    msg: 'Upps ocurrio un error (deleteOneRow)',
                    error: error
                });
            }
        });
    }
    /**
     * ["TableName", { nombre: "Juan" , apellido: "Perez" , ... }]
     *
     * @param strTable          Nombre de la tabla
     * @param data              Datos a insertar
     * @returns
     */
    insertOneRow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body, "BODY");
            const [strtTable, data] = req.body;
            const ModelToUse = QueryBasicController.ModelTableMap(strtTable);
            if (!ModelToUse) {
                return res.status(400).json({
                    msg: 'Modelo no encontrado para la tabla especificada',
                });
            }
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                /** Inserción de la data */
                yield ModelToUse.create(data, { transaction });
                /** Si todo va bien confirmamos la transacción */
                yield transaction.commit();
                res.json('El registro a sido creado correctamente ');
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones */
                yield transaction.rollback();
                // Manejo del error
                let errorMessage = 'Error desconocido';
                if (error instanceof sequelize_1.BaseError || error instanceof Error) {
                    errorMessage = error.message;
                }
                // Retornamos un error controlado
                res.status(400).json({ msg: errorMessage });
            }
        });
    }
    /**
     * ["TableName", { id: 1 }, { nombre: "Pepe" , apellido: "Perez" , ... }]
     * @param strTable          Nombre de la tabla
     * @param objCondition      Condición de id para la actualización
     * @param data              Datos a actualizar
     * @returns
     */
    updateOneRow(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [strTable, objCondition, data] = req.body;
            const ModelToUse = QueryBasicController.ModelTableMap(strTable);
            if (!ModelToUse) {
                return res.status(400).json({
                    msg: 'Modelo no encontrado para la tabla especificada',
                });
            }
            /** Iniciamos una transacción (rollback) */
            const transaction = yield connection_1.default.transaction();
            try {
                /** Actualización de la data */
                yield ModelToUse.update(data, {
                    where: objCondition,
                    transaction: transaction
                });
                /** Si todo va bien confirmamos la transacción */
                yield transaction.commit();
                res.json('El registro a sido actualizado');
            }
            catch (error) {
                /** Si hay un error, revertimos todas las operaciones */
                yield transaction.rollback();
                // Manejo del error
                let errorMessage = 'Error desconocido';
                if (error instanceof sequelize_1.BaseError || error instanceof Error) {
                    errorMessage = error.message;
                }
                // Retornamos un error controlado
                res.status(400).json({ msg: errorMessage });
            }
        });
    }
}
exports.queryBasicController = new QueryBasicController();
