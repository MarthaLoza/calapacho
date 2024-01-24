import { Request, Response } from "express";
import { Sequelize, literal } from "sequelize";
import { Ctercero } from "../models/ctercero";

class TerceroController {
    
    public async newTercero (req: Request, res: Response) {

        const { codigo, nombre, nomaux, ciftyp,  cif } = req.body;
        let m_tcif = 'DNI';

        // Validamos si el tercero existe en la base de datos por el cif
        const m_exist = await Ctercero.findOne({where: {cif: cif}})

        // Confirmamos que tipo de cif es
        if(ciftyp == '1') m_tcif = 'RUC';
        if(ciftyp == '2') m_tcif = 'Canet de extrangería';

        if(m_exist) {
            return res.status(400).json({
                msg: `Ya existe un registro con este ${m_tcif}.`
            })
        }

        try {
            //Guardamos al tercer en la base de datos

            await Ctercero.create({
                codigo: codigo,
                nombre: nombre,
                nomaux: nomaux,
                ciftyp: ciftyp,
                cif: cif
            })

            res.json({
                msg: `El  registro se creó exitosamente`
            })
        } catch (error) {
            res.status(400).json({
                msg: 'Upps ocurrio un error',
                error
            })
        }
    }

    public async getCodTercero (req: Request, res: Response){
        // Traemos los parametros que vienen desde la URL
        const { cod } = req.params;

        // Se realiza la consutla SQL para poder generar el código que necesitamos
        const codTercero = await Ctercero.findOne({
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT '${cod}' || LPAD(CAST(CAST(SUBSTRING(codigo FROM 2 FOR 4) AS INTEGER) + 1 AS VARCHAR), 4, '0')
                            FROM ctercero
                            WHERE codigo = (SELECT MAX(codigo) FROM ctercero WHERE codigo LIKE '${cod}____')
                        )`), 'getCodigo'
                    ]
                ]
            }
        })
        
        let codigo = codTercero?.dataValues.getCodigo;

        // Condiciamos si el código aun no existe
        if(!codigo) codigo = `${cod}0001`;

        // Retornamos una respuesta
        res.json(codigo)
        
    }
}

export const terceroController = new TerceroController();