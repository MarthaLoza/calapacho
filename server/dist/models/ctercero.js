"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ctercero = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Ctercero = connection_1.default.define('ctercero', {
    seqno: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
    },
    codigo: {
        type: sequelize_1.DataTypes.STRING(5),
        primaryKey: true,
        allowNull: false,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false,
    },
    nomaux: {
        type: sequelize_1.DataTypes.STRING(128),
    },
    ciftyp: {
        type: sequelize_1.DataTypes.STRING(1),
    },
    cif: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A',
    },
    fecbaj: {
        type: sequelize_1.DataTypes.DATE,
    },
    coment: {
        type: sequelize_1.DataTypes.STRING(60),
    },
    user_created: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    user_updated: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    date_updated: {
        type: sequelize_1.DataTypes.DATE,
    },
}, {
    freezeTableName: true,
    timestamps: false,
});
