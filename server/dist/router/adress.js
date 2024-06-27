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
        this.router.post('/provincia/:coddep', adress_1.adressController.getProvincia);
        this.router.post('/distrito/:coddep/:codprv', adress_1.adressController.getDistrito);
    }
}
const adressRoutes = new AdressRoutes();
exports.default = adressRoutes.router;
