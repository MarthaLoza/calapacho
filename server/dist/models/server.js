"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const menu_1 = __importDefault(require("../router/menu"));
const user_1 = __importDefault(require("../router/user"));
const tercero_1 = __importDefault(require("../router/tercero"));
const adress_1 = __importDefault(require("../router/adress"));
const user_2 = require("./user");
const query_basic_1 = __importDefault(require("../router/query-basic"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Aplicación corriendo en el puerto ' + this.port);
        });
    }
    routes() {
        this.app.use('/api/menu', menu_1.default);
        this.app.use('/api', user_1.default);
        this.app.use('/api/tercero/user', tercero_1.default);
        this.app.use('/api/adress', adress_1.default);
        this.app.use('/query/basic', query_basic_1.default);
    }
    midlewares() {
        //Parseo body
        this.app.use(express_1.default.json());
        //Cors
        this.app.use((0, cors_1.default)());
    }
    dbConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //await Product.sync()
                yield user_2.User.sync();
            }
            catch (error) {
                console.log("Unable to connect to the database: ", error);
            }
        });
    }
}
exports.default = Server;
