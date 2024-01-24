"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_1 = require("../controllers/menu");
const validate_token_1 = __importDefault(require("./validate-token"));
//import validateToken from "./validate-token";
const router = (0, express_1.Router)();
router.get('/', validate_token_1.default, menu_1.getMenu);
exports.default = router;
