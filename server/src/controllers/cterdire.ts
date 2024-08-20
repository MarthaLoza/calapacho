import { Request, Response } from "express";
import { Cterdire } from "../models/cterdire";
import sequelize from "../db/connection";
import { Op } from "sequelize";

class CterdireController {

    /** Lista de direcciones de terceros con o sin filtro */
    public async getDirecciones (req: Request, res: Response) {
        console.log(req.body, "BODY");
        
        const { codigo, tipdir, coddep, codprv, coddis, direcc, contac, telef1, email } = req.body;
        
        // Crear el objeto de condiciones
        const conditions: { [key: string]: any }[] = [];
        
        
        if (tipdir === 0 || ( tipdir != null && tipdir != '' && tipdir != undefined)) { 
            console.log(tipdir, "ERRORTIPDIR");
            
            conditions.push({ tipdir: { [Op.eq] : tipdir } }); 
        }
        
        if (codigo) conditions.push({ codigo:   { [Op.like] : codigo        }});
        if (coddep) conditions.push({ coddep:   { [Op.like] : coddep        } });
        if (codprv) conditions.push({ codprv:   { [Op.like] : codprv        } });
        if (coddis) conditions.push({ coddis:   { [Op.like] : coddis        } });
        if (direcc) conditions.push({ direcc:   { [Op.like] : `%${direcc}%` } });
        if (contac) conditions.push({ contac:   { [Op.like] : `%${contac}%` } });
        if (telef1) conditions.push({ telef1:   { [Op.like] : `%${telef1}%` } });
        if (email)  conditions.push({ email:    { [Op.like] : `%${email}%`  } });

        // Crear la condición principal utilizando Op.and si hay condiciones, de lo contrario usar 1=1
        const condition = conditions.length > 0 ? { [Op.and]: conditions } : {};
        console.log(condition, "CONDITION1");
        
        try {
            const tercero = await Cterdire.findAll({
                where: condition,
                attributes: ['codigo','tipdir', 'coddep', 'codprv', 'coddis', 'direcc', 'contac', 'telef1', 'email',
                [sequelize.literal(`
                    CASE
                    WHEN tipdir = 0 THEN 'Dirección fiscal'
                    WHEN tipdir = 1 THEN 'Dirección 1'
                    WHEN tipdir = 2 THEN 'Dirección 2'
                    WHEN tipdir = 3 THEN 'Dirección 3'
                    END
                `), 'nomdir']],
                order: [['tipdir', 'DESC']],
                //where: { codigo }
            });
        
            res.json(tercero);

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los terceros');
        }
    }

}

export const cterdireController = new CterdireController();