import { DataTypes } from "sequelize"
import sequelize from "../db/connection"

export const User = sequelize.define('portal_user', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_code: {
        type: DataTypes.CHAR(12),
        allowNull: false,
    },
    user_name: {
        type: DataTypes.STRING(60),
        allowNull: false,
    },
    lang_code: {
        type: DataTypes.CHAR(2),
        defaultValue: 'es',
    },
    user_password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING(90),
    },
    dark_theme: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    force_password_change: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    user_active: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, 
{
    freezeTableName: true,
    timestamps: false
})