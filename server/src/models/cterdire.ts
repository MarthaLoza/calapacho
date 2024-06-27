import { DataTypes } from "sequelize"
import sequelize from "../db/connection"

export const Cterdire = sequelize.define('cterdire', {
    codigo: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'ctercero',
          key: 'codigo'
        }
      },
      tipdir: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      direcc: {
        type: DataTypes.STRING(128),
        allowNull: false
      },
      coddis: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'gdistrit',
          key: 'coddis'
        }
      },
      codprv: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'gprovinc',
          key: 'codprv'
        }
      },
      coddep: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        references: {
          model: 'gdeparta',
          key: 'coddep'
        }
      },
      contac: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      telef1: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      telef2: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: true
      },
      estado: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        defaultValue: 'A'
      },
      gps_latitud: {
        type: DataTypes.DECIMAL(14, 10),
        allowNull: true
      },
      gps_longitud: {
        type: DataTypes.DECIMAL(14, 10),
        allowNull: true
      },
      user_created: {
        type: DataTypes.STRING(20),
      },
      date_created: {
        type: DataTypes.DATE,
      },
      user_updated: {
        type: DataTypes.STRING(20),
      },
      date_updated: {
        type: DataTypes.DATE,
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
})