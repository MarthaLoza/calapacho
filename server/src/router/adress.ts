import { Router } from "express";
import { adressController } from "../controllers/adress";

class AdressRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/departa',  adressController.getDeparta);
        this.router.post('/provincia/:coddep', adressController.getProvincia);
        this.router.post('/distrito/:coddep/:codprv', adressController.getDistrito);
    }

}

const adressRoutes = new AdressRoutes();
export default adressRoutes.router;