import { Router } from "express";
import { queryBasicController } from "../controllers/query-basic";

class QueryBasicRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.delete('/delete', queryBasicController.deleteOneRow);
        this.router.post('/insert', queryBasicController.insertOneRow);
    }

}

const queryRoutes = new QueryBasicRoutes();
export default queryRoutes.router;