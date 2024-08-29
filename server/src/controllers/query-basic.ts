import { Request, Response } from "express";
import { Model, ModelStatic, Sequelize, BaseError } from "sequelize";
import sequelize from "../db/connection";
import { Ctercero } from "../models/ctercero";
import { Cterdire } from "../models/cterdire";

class QueryBasicController {

    /**
     * Este metodo se encarga de mapear el nombre de la tabla con el modelo correspondiente
     * para poder devolver el modelo correspondiente a la tabla.
     * @param tableName     Nombre de la tabla String
     * @returns             Nombre de la tabla Modelo
     */
    private static ModelTableMap(tableName: string): ModelStatic<Model<any, any>> | null {
        const modelMap: { [key: string]: ModelStatic<Model<any, any>> } = {
            'Ctercero': Ctercero,
            'Cterdire': Cterdire
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
    public async deleteOneRow(req: Request, res: Response) {
        
        const [ strTable, objCondition ] = req.body

        const ModelToUse = QueryBasicController.ModelTableMap(strTable);

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

            // Manejo del error
            let errorMessage = 'Error desconocido';

            if (error instanceof BaseError || error instanceof Error) {
                errorMessage = error.message;
            }

            // Retornamos un error controlado
            res.status(400).json({ msg: errorMessage });
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

        const [ strtTable, data ]  = req.body;
        
        const ModelToUse = QueryBasicController.ModelTableMap(strtTable);

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

            // Manejo del error
            let errorMessage = 'Error desconocido';

            if (error instanceof BaseError || error instanceof Error) {
                errorMessage = error.message;
            }

            // Retornamos un error controlado
            res.status(400).json({ msg: errorMessage });
        }
    }

    /**
     * ["TableName", { id: 1 }, { nombre: "Pepe" , apellido: "Perez" , ... }]
     * @param strTable          Nombre de la tabla
     * @param objCondition      Condición de id para la actualización
     * @param data              Datos a actualizar
     * @returns 
     */
    public async updateOneRow(req: Request, res: Response) {
        const [ strTable, objCondition, data ] = req.body;

        const ModelToUse = QueryBasicController.ModelTableMap(strTable);


        if (!ModelToUse) {
            return res.status(400).json({
                msg: 'Modelo no encontrado para la tabla especificada',
            });
        }

        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {
            /** Actualización de la data */
            await ModelToUse.update(data, {
                where       : objCondition,
                transaction : transaction
            });

            /** Si todo va bien confirmamos la transacción */
            await transaction.commit();

            res.json('El registro a sido actualizado');
        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones */
            await transaction.rollback();
            console.log(error, "ERROR");
            
            // Manejo del error
            let errorMessage = 'Error desconocido';

            if (error instanceof BaseError || error instanceof Error) {
                console.log("ENTRAAA", error.message);
                
                errorMessage = error.message;
            }

            // Retornamos un error controlado
            res.status(400).json({ msg: errorMessage });
        }
    }
}

export let queryBasicController = new QueryBasicController();