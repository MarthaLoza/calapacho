import { Response, Request } from "express";
import bcrypt from 'bcrypt';
import { User } from "../models/user";
import jwt from 'jsonwebtoken';

export const newUser = async (req: Request, res: Response) => {

    const { user_code, user_name, user_password, user_email } = req.body;
    
    //Validamos si el usuario ya existe en la base de datos
   const exist_user = await User.findOne({where: { user_code: user_code }})

   if(exist_user){
        return res.status(400).json({
            msg: `El usuario ${user_name} ya existe.`
        })
   }
    
    const hasedPassword = await bcrypt.hash(user_password, 10)

    try {
        //Guardamos usuario en la base de datos
        await User.create({

            user_code: user_code,
            user_name: user_name,
            user_password: hasedPassword,
            user_email: user_email
        })
    
        res.json({
            msg: `Usuario ${user_name} creado exitosamente.`
        })
        
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }

}

export const loginUser = async (req: Request, res: Response) => {

    const { user_code, user_name, user_password, user_email } = req.body;
    
    //Validamos si el usuario existe en la base de datos
    const exist_user: any = await User.findOne({where: { user_name: user_name }});
    
    if(!exist_user){

        return res.status(400).json({
            msg: `El usuario ${user_name} no existe en la base de datos`
        })
    }

    //Validamos el password
    const passwordValid = await bcrypt.compare(user_password, exist_user.user_password)
    if(!passwordValid){
        return res.status(400).json({
            msg: `Contraseña incorrecto`
        })
    }

    //Generamos token
    const token = jwt.sign({
        user_name: user_name
    }, process.env.SECRET_KEY || 'pepito123'
    //,{ expiresIn: '10000'}
    );

    res.json(token);  
}
