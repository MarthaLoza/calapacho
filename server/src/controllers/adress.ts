import { Request, Response } from "express";
import { Sequelize, literal } from "sequelize";
import { Gdeparta } from "../models/departa";

class AdressController {

    /** Trae los departamentos de la base de datos */
    public async getDeparta (req: Request, res: Response){
        const departamentos = await Gdeparta.findAll({
            attributes: [['nomdep', 'label'], ['coddep', 'value']]
        });
        
        res.json(departamentos)
    }
}

export const adressController = new AdressController();