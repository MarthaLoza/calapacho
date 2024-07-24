import { Request, Response } from "express";
import { Model, ModelStatic, Sequelize } from "sequelize";
import sequelize from "../db/connection";
import { Ctercero } from "../models/ctercero";

class QueryBasicController {

    public async deleteOneRow(req: Request, res: Response) {
        
        const [ strTable, objCondition ] = req.body

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
                msg     : 'Upps ocurrio un error',
                error   : error
            });
        }
    }
}

export let queryBasicController = new QueryBasicController();