import { Router } from "express";
import { getMenu } from "../controllers/menu";
import validateToken from "./validate-token";
//import validateToken from "./validate-token";

const router = Router();

router.get('/', validateToken, getMenu);

export default router;