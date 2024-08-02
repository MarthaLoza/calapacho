import { Request, Response } from "express";
import { Model, ModelStatic, Sequelize } from "sequelize";
import sequelize from "../db/connection";
import { Ctercero } from "../models/ctercero";
import { Cterdire } from "../models/cterdire";

class QueryBasicController {

    //private getModelMap(): { [key: string]: ModelStatic<Model<any, any>> } {
    //    return {
    //        'Ctercero': Ctercero,
    //        'Cterdire': Cterdire
    //    };
    //}
//
    //private getModelByName(tableName: string): ModelStatic<Model<any, any>> | null {
    //    const modelMap = this.getModelMap();
    //    return modelMap[tableName] || null;
    //}

    /**
     * ["strTable", { id : 1 }]
     * 
     * @param strTable          Nombre de la tabla
     * @param objCondition      Condición de id para la eliminación 
     * @returns 
     */
    public async deleteOneRow(req: Request, res: Response) {
        
        const [ strTable, objCondition ] = req.body
        console.log(strTable, req);
        
        /** Mapeo de nombres de tablas a modelos */
        const modelMap: { [key: string]: ModelStatic<Model<any, any>> } = {
            'Ctercero': Ctercero
        };

        const ModelToUse = modelMap[strTable];

        if (!ModelToUse) {
            return res.status(400).json({
                msg: 'Modelo no encontrado para la tabla especificada',
            });
        }

        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {

            await ModelToUse.destroy({
                where       : objCondition,
                force       : true,
                transaction : transaction
            });

            /** Si todo va bien, confirmamos la transacción */
            await transaction.commit();

            res.json('El registro a sido eliminado');
            
        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones */
            await transaction.rollback();

            console.log(error);
            
            /** Retornamos un error controlado */
            res.status(400).json({
                msg     : 'Upps ocurrio un error (deleteOneRow)',
                error   : error
            });
        }
    }

    /**
     * ["TableName", { nombre: "Juan" , apellido: "Perez" , ... }]
     * 
     * @param strTable          Nombre de la tabla
     * @param data              Datos a insertar
     * @returns 
     */
    public async insertOneRow(req: Request, res: Response) {
        console.log(req.body, "BODY");
        const [ strtable, data ]  = req.body;

        /** Mapeo de nombres de tablas a modelos */
        const modelMap: { [key: string]: ModelStatic<Model<any, any>> } = {
            'Ctercero': Ctercero
        };

        const ModelToUse = modelMap[strtable];

        if (!ModelToUse) {
            return res.status(400).json({
                msg: 'Modelo no encontrado para la tabla especificada',
            });
        }

        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {
            /** Inserción de la data */
            await ModelToUse.create(data, { transaction });

            /** Si todo va bien confirmamos la transacción */
            await transaction.commit();

            res.json('El registro a sido creado correctamente ');

        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones */
            await transaction.rollback();

            console.log(error);
            
            /** Retornamos un error controlado */
            res.status(400).json({
                msg     : 'Upps ocurrio un error (insertOneRow)',
                error   : error
            });
        }
    }
}

export let queryBasicController = new QueryBasicController();