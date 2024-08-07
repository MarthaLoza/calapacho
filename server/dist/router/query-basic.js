"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const query_basic_1 = require("../controllers/query-basic");
class QueryBasicRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.delete('/delete', query_basic_1.queryBasicController.deleteOneRow);
        this.router.post('/insert', query_basic_1.queryBasicController.insertOneRow);
        this.router.put('/update', query_basic_1.queryBasicController.updateOneRow);
    }
}
const queryRoutes = new QueryBasicRoutes();
exports.default = queryRoutes.router;
