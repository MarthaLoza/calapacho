"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adress_1 = require("../controllers/adress");
class AdressRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/departa', adress_1.adressController.getDeparta);
        //this.router.get('/create/:cod', terceroController.getCodTercero)
    }
}
const adressRoutes = new AdressRoutes();
exports.default = adressRoutes.router;
