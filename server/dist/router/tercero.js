"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tercero_1 = require("../controllers/tercero");
class TerceroRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/create', tercero_1.terceroController.newTercero);
        this.router.get('/create/:cod', tercero_1.terceroController.getCodTercero);
        this.router.get('/list', tercero_1.terceroController.getTerceros);
    }
}
const terceroRoutes = new TerceroRoutes();
exports.default = terceroRoutes.router;
