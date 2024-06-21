import { Router } from "express";
import { adressController } from "../controllers/adress";

class AdressRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/departa',  adressController.getDeparta)
        //this.router.get('/create/:cod', terceroController.getCodTercero)
    }

}

const adressRoutes = new AdressRoutes();
export default adressRoutes.router;