"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gdistrit = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Gdistrit = connection_1.default.define('gdistrit', {
    coddep: {
        type: sequelize_1.DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'gdeparta',
            key: 'coddep'
        }
    },
    codprv: {
        type: sequelize_1.DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'gprovinc',
            key: 'codprv'
        }
    },
    coddis: {
        type: sequelize_1.DataTypes.CHAR(2),
        allowNull: false
    },
    nomdis: {
        type: sequelize_1.DataTypes.STRING(60),
        allowNull: false
    },
    ubigeo: {
        type: sequelize_1.DataTypes.CHAR(6),
        allowNull: false
    },
    estado: {
        type: sequelize_1.DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A'
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
            name: 'i_gdistrit1',
            fields: ['nomdis']
        }
    ]
});
