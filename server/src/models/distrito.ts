import { DataTypes } from "sequelize"
import sequelize from "../db/connection"

export const Gdistrit = sequelize.define('gdistrit', {
    coddep: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'gdeparta',
          key: 'coddep'
        }
    },
    codprv: {
        type: DataTypes.CHAR(4),
        allowNull: false,
        references: {
          model: 'gprovinc',
          key: 'codprv'
        }
    },
    coddis: {
        type: DataTypes.CHAR(6),
        allowNull: false
    },
    nomdis: {
        type: DataTypes.STRING(60),
        allowNull: false
    },
    ubigeo: {
        type: DataTypes.CHAR(6),
        allowNull: false
    },
    estado: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A'
    },
    user_created: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    date_created: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_updated: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    date_updated: {
        type: DataTypes.DATE,
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
    })
    