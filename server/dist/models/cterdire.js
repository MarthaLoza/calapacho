"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cterdire = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.Cterdire = connection_1.default.define('cterdire', {
    codigo: {
        type: sequelize_1.DataTypes.CHAR(5),
        allowNull: false,
        primaryKey: true,
        references: {
            model: 'ctercero',
            key: 'codigo'
        }
    },
    tipdir: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    direcc: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: false
    },
    coddis: {
        type: sequelize_1.DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'gdistrit',
            key: 'coddis'
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
    coddep: {
        type: sequelize_1.DataTypes.CHAR(2),
        allowNull: false,
        references: {
            model: 'gdeparta',
            key: 'coddep'
        }
    },
    contac: {
        type: sequelize_1.DataTypes.STRING(60),
        allowNull: true
    },
    telef1: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    telef2: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true
    },
    email: {
        type: sequelize_1.DataTypes.STRING(128),
        allowNull: true
    },
    estado: {
        type: sequelize_1.DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A'
    },
    gps_latitud: {
        type: sequelize_1.DataTypes.DECIMAL(14, 10),
        allowNull: true
    },
    gps_longitud: {
        type: sequelize_1.DataTypes.DECIMAL(14, 10),
        allowNull: true
    },
    user_created: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    date_created: {
        type: sequelize_1.DataTypes.DATE,
    },
    user_updated: {
        type: sequelize_1.DataTypes.STRING(20),
    },
    date_updated: {
        type: sequelize_1.DataTypes.DATE,
    }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
        {
            name: 'i_cterdire1',
            fields: ['codigo', 'tipdir']
        }
    ]
});
