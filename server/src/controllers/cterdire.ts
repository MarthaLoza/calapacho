import { Request, Response } from "express";
import { Cterdire } from "../models/cterdire";
import sequelize from "../db/connection";

class CterdireController {

    /** Método para traer las direcciones de los terceros */
    public async getDirecciones (req: Request, res: Response){
        
        const { codigo } = req.params;

        const direcciones = await Cterdire.findAll({

            attributes: ['codigo','tipdir', 'direcc', 'telef1',
            [sequelize.literal(`
                CASE
                WHEN tipdir = 0 THEN 'Dirección fiscal'
                WHEN tipdir = 1 THEN 'Dirección 1'
                WHEN tipdir = 2 THEN 'Dirección 2'
                WHEN tipdir = 3 THEN 'Dirección 3'
                END
            `), 'nomdir']],
            order: [['tipdir', 'ASC']],
            where: { codigo }
        });

        // Retornamos la información de la consulta
        res.json( direcciones )
    }

    public async getOneDireccion (req: Request, res: Response){
        
        const { codigo, tipdir } = req.params;

        const direccion = await Cterdire.findOne({
            where: { codigo, tipdir }
        });

        // Retornamos la información de la consulta
        res.json( direccion )
    }

}

export const cterdireController = new CterdireController();