import { Request, Response } from "express";
import { Gdeparta } from "../models/departa";
import { Gprovinc } from "../models/provinc";
import { Gdistrit } from "../models/distrito";

class AdressController {

    /** Trae los departamentos de la base de datos */
    public async getDeparta (req: Request, res: Response){
        const departamentos = await Gdeparta.findAll({
            attributes: [['nomdep', 'label'], ['coddep', 'value']]
        });
        
        res.json(departamentos)
    }

    /** Trae las provincias segun el departamento */
    public async getProvincia (req: Request, res: Response){
        
        const { coddep } = req.params;
        console.log(coddep)
        const provincias = await Gprovinc.findAll({
            attributes: [['nomprv', 'label'], ['codprv', 'value']],
            where: {
                coddep
            }
        });
        
        res.json(provincias)
    }

    /** Trae los distritos segun departamento y provincia */
    public async getDistrito (req: Request, res: Response){
        const { coddep, codprv } = req.params;
        
        const distritos = await Gdistrit.findAll({
            attributes: [['nomdis', 'label'], ['coddis', 'value']],
            where: {
                coddep,
                codprv
            }
        });
        
        res.json(distritos)
    }
}

export const adressController = new AdressController();