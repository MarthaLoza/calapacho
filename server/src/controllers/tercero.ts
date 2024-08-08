import { Request, Response } from "express";
import { Op, Sequelize, literal } from "sequelize";
import { Ctercero } from "../models/ctercero";
import { Cterdire } from "../models/cterdire";
import sequelize from "../db/connection";

/** Función para generar el código del tercero */
async function generateCodigoTercero(cod: string): Promise<string> {
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
    });

    let codigo = codTercero?.dataValues.getCodigo;

    if (!codigo) codigo = `${cod}0001`;

    return codigo;
}

class TerceroController {

    constructor() {
    }

    /** Método para generar el tercero por medio de API */
    public async calculateCodTercero (req: Request, res: Response) {
        
        try {
            const { cod }   = req.params;
            const codigo    = await generateCodigoTercero(cod);

            res.json(codigo);
        } catch (error) {
            res.status(500).json({ 
                msg: 'Error al calcular el código del tercero', 
                error 
            });
        }
    }

    /** Nuevo tercero */
    public async newTercero (req: Request, res: Response) {

        const { terType,codigo, nombre, nomaux, ciftyp,  cif, coment, estado, tipdir, direcc, coddep, codprv, coddis, telef1, email, contac } = req.body;
        console.log(terType, 'terType');
        let mCif = null;
        let mErr = null;
        
        switch (ciftyp) {
            case '0':
                if(cif.length != 11) mErr = 'El RUC debe tener 11 caracteres.'
                mCif = 'RUC';
                break;

            case '1':
                if(cif.length != 8) mErr = 'El DNI debe tener 8 caracteres.'
                mCif = 'DNI';
                break;

            case '2':
                if(cif.length != 12) mErr = 'La canet de extrangería debe tener 12 caracteres.'
                mCif = 'Canet de extrangería';
                break;
        }

        // Validamos si el tercero existe en la base de datos por el cif
        const mExist = await Ctercero.findOne({where: {cif: cif}})
        
        if(mExist || mErr) {
            return res.status(400).json({
                msg: mErr || `Ya existe un registro con este ${mCif}.`
            })
        }

        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {

            /** Volvemos a calcular el código del tercero */
            //let codigo = await generateCodigoTercero(terType);

            /** Guardamos la información del tercero */
            const data = await Ctercero.create({
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
                msg     : `El  registro se creó exitosamente`,
                data 
            })

        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones realizadas en la transacción */
            await transaction.rollback();
            console.log(error);
            
            /** Retornamos un error controlado */
            res.status(400).json({
                msg: 'Upps ocurrio un error',
                error
            })
        }
    }

    /** Lista de terceros con o sin filtro */
    public async getTerceros (req: Request, res: Response) {
        const { terType, codigo, nombre, nomaux, ciftyp, cif, coment, estado } = req.body;
        
        // Crear el objeto de condiciones
        const conditions: { [key: string]: any }[] = [];

        if (terType) conditions.push({ codigo:  { [Op.like]: `${terType}%`  } });
        if (codigo)  conditions.push({ codigo:  { [Op.like]: codigo         } });
        if (nombre)  conditions.push({ nombre:  { [Op.like]: `%${nombre}%`  } });
        if (nomaux)  conditions.push({ nomaux:  { [Op.like]: `%${nomaux}%`  } });
        if (ciftyp)  conditions.push({ ciftyp:  { [Op.like]: ciftyp         } });
        if (cif)     conditions.push({ cif:     { [Op.like]: `%${cif}%`     } });
        if (coment)  conditions.push({ coment:  { [Op.like]: `%${coment}%`  } });
        if (estado)  conditions.push({ estado:  { [Op.like]: estado         } });

        // Crear la condición principal utilizando Op.and si hay condiciones, de lo contrario usar 1=1
        const condition = conditions.length > 0 ? { [Op.and]: conditions } : {};

        try {
            const tercero = await Ctercero.findAll({
              where: condition,
              attributes: [
                'seqno', 'codigo', 'nombre', 'nomaux', 'ciftyp', 'cif', 'estado', 'coment'
              ],
              order: [['seqno', 'DESC']]
            });
        
            res.json(tercero);
          } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener los terceros');
          }
    }

    /** Trae un tercero */
    public async getOneTercero (req: Request, res: Response) {
        const { seqno } = req.params;

        const tercero = await Ctercero.findOne({
            where: { seqno }
        });

        res.json(tercero);
    }

    /** Edita un tercero */
    public async editTercero (req: Request, res: Response) {
        const { seqno } = req.params;
        const { codigo, nombre, nomaux, ciftyp, cif, coment, estado } = req.body;

        const tercero = await Ctercero.update({
            codigo, nombre, nomaux, ciftyp, cif, coment, estado
        }, {
            where: { seqno }
        });

        res.json({
            msg: 'El registro se actualizó exitosamente'
        });
    }

    /** Elimina un tercero */
    public async deleteTercero (req: Request, res: Response) {
        const { codigo } = req.params;

        /** Iniciamos una transacción (rollback) */
        const transaction = await sequelize.transaction();

        try {

            /** Eliminación del tercero */
            const tercero = await Ctercero.destroy({
                where: { codigo }
            });

            /** Eliminación de la dirección del tercero */
            const direcciones = await Cterdire.destroy({
                where: { codigo }
            });
            
            /** Si todo va bien, confirmamos la transacción */
            await transaction.commit();

            res.json({
                msg: 'El registro a sido eliminado'
            });
            
        } catch (error) {
            /** Si hay un error, revertimos todas las operaciones */
            await transaction.rollback();

            /** Retornamos un error controlado */
            res.status(400).json({
                msg: 'Upps ocurrio un error',
                error
            });
        }
    }
}

export let terceroController = new TerceroController();