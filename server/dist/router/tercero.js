"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tercero_1 = require("../controllers/tercero");
const cterdire_1 = require("../controllers/cterdire");
class TerceroRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/create/:cod', tercero_1.terceroController.calculateCodTercero);
        this.router.post('/create', tercero_1.terceroController.newTercero);
        this.router.post('/list', tercero_1.terceroController.getTerceros);
        this.router.post('/list/:seqno', tercero_1.terceroController.getOneTercero);
        this.router.post('/direcciones', cterdire_1.cterdireController.getDirecciones);
        this.router.put('/update/:seqno', tercero_1.terceroController.editTercero);
        this.router.delete('/delete/:codigo', tercero_1.terceroController.deleteTercero);
    }
}
const terceroRoutes = new TerceroRoutes();
exports.default = terceroRoutes.router;
