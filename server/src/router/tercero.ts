import { Router } from "express";
import { terceroController } from "../controllers/tercero";
import { cterdireController } from "../controllers/cterdire";

class TerceroRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.get('/create/:cod', terceroController.calculateCodTercero);
        this.router.post('/create',  terceroController.newTercero);
        this.router.get('/list', terceroController.getTerceros);
        this.router.post('/list/:seqno', terceroController.getOneTercero);
        this.router.post('/list/direcciones/:codigo', cterdireController.getDirecciones);
        this.router.post('/list/direccion/:codigo/:tipdir', cterdireController.getOneDireccion);
        this.router.put('/update/:seqno', terceroController.editTercero);
        this.router.delete('/delete/:codigo', terceroController.deleteTercero);
    }

}

const terceroRoutes = new TerceroRoutes();
export default terceroRoutes.router;