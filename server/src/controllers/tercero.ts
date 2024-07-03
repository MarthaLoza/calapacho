import { Request, Response } from "express";
import { Sequelize, literal } from "sequelize";
import { Ctercero } from "../models/ctercero";
import { Cterdire } from "../models/cterdire";
import sequelize from "../db/connection";

class TerceroController {
    
    public async newTercero (req: Request, res: Response) {

        const { codigo, nombre, nomaux, ciftyp,  cif, coment, estado, tipdir, direcc, coddep, codprv, coddis, telef1, email, contac } = req.body;
        let m_tcif = 'RUC';

        // Valworkamos si el tercero existe en la base de datos por el cif
        const m_exist = await Ctercero.findOne({where: {cif: cif}})

        // Confirmamos que tipo de cif es
        if(ciftyp == '1') m_tcif = 'DNI';
        if(ciftyp == '2') m_tcif = 'Canet de extrangería';

        if(m_exist) {
            return res.status(400).json({
                msg: `Ya existe un registro con este ${m_tcif}.`
            })
        }
        
        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {
            /** Guardamos la información del tercero */
            await Ctercero.create({
                codigo  : codigo,
                nombre  : nombre,
                nomaux  : nomaux,
                ciftyp  : ciftyp,
                cif     : cif,
                coment  : coment,
                estado  : estado
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
            await transaction.commit();

            res.json({
                msg: `El  registro se creó exitosamente`
            })

        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones realizadas en la transacción */
            await transaction.rollback();

            /** Retornamos un error controlado */
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

    public async getTerceros (req: Request, res: Response) {
        const tercero = await Ctercero.findAll({
            attributes: ['seqno', 'codigo', 'nombre', 'cif'],
            order: [['seqno', 'ASC']]
        });

        res.json(tercero);
    }

    public async getOneTercero (req: Request, res: Response) {
        const { seqno } = req.params;

        const tercero = await Ctercero.findOne({
            where: { seqno }
        });

        res.json(tercero);
    }
}

export const terceroController = new TerceroController();