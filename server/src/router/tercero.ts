import { Router } from "express";
import { terceroController } from "../controllers/tercero";

class TerceroRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.post('/create',  terceroController.newTercero)
        this.router.get('/create/:cod', terceroController.getCodTercero)
        this.router.get('/list', terceroController.getTerceros)
    }

}

const terceroRoutes = new TerceroRoutes();
export default terceroRoutes.router;