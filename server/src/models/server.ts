import express, { Application } from 'express';
import cors from 'cors';
import routesMenu from '../router/menu';
import routesUser from '../router/user';
import ruotesTercero from '../router/tercero';
import adressRoutes from '../router/adress';
import { User } from './user';
import queryBasic from '../router/query-basic';


class Server{

    private app: Application;
    private port: string;

    constructor(){
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {        
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto ' + this.port);
        })
    }

    routes() {
        this.app.use('/api/menu', routesMenu);
        this.app.use('/api', routesUser);
        this.app.use('/api/tercero/user', ruotesTercero);
        this.app.use('/api/adress', adressRoutes);
        this.app.use('/query/basic', queryBasic)
    }

    midlewares() {
        //Parseo body
        this.app.use(express.json());

        //Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            //await Product.sync()
            await User.sync()
            
        } catch (error) {
            console.log("Unable to connect to the database: ", error);
            
        }
    }
}

export default Server;