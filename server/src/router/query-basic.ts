import { Router } from "express";
import { queryBasicController } from "../controllers/query-basic";

class QueryBasicRoutes {

    public router: Router = Router();

    constructor() {
        this.config();
    }

    config() {
        this.router.delete('/delete', queryBasicController.deleteOneRow);
    }

}

const queryRoutes = new QueryBasicRoutes();
export default queryRoutes.router;