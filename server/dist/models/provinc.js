"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gprovinc = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Gprovinc = connection_1.default.define('gprovinc', {
    coddep: {
        type: sequelize_1.DataTypes.CHAR(2),
        primaryKey: true,
        allowNull: false,
    },
    codprv: {
        type: sequelize_1.DataTypes.CHAR(4),
        primaryKey: true,
        allowNull: false,
    },
    nomprv: {
        type: sequelize_1.DataTypes.STRING(60),
        allowNull: false,
    },
    estado: {
        type: sequelize_1.DataTypes.CHAR(1),
        defaultValue: 'A',
    },
    user_created: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    },
    user_updated: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false
    },
    date_updated: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        {
            name: 'i_gprovinc1',
            fields: ['nomprv']
        }
    ]
});
