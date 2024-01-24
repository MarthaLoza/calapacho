"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = __importDefault(require("../db/connection"));
exports.User = connection_1.default.define('portal_user', {
    user_id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_code: {
        type: sequelize_1.DataTypes.CHAR(12),
        allowNull: false,
    },
    user_name: {
        type: sequelize_1.DataTypes.STRING(60),
        allowNull: false,
    },
    lang_code: {
        type: sequelize_1.DataTypes.CHAR(2),
        defaultValue: 'es',
    },
    user_password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    user_email: {
        type: sequelize_1.DataTypes.STRING(90),
    },
    dark_theme: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    force_password_change: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    user_active: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    freezeTableName: true,
    timestamps: false
});
