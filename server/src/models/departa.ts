import { DataTypes } from "sequelize"
import sequelize from "../db/connection"

export const Gdeparta = sequelize.define('gdeparta', {
    coddep: {
        type: DataTypes.CHAR(2),
        primaryKey: true,
        allowNull: false,
      },
      nomdep: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      estado: {
        type: DataTypes.CHAR(1),
        defaultValue: 'A',
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
            name: 'i_gdeparta1',
            fields: ['nomdep']
            }
        ]
    })