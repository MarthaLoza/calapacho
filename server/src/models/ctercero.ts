import { DataTypes } from 'sequelize';
import sequelize from "../db/connection"

export const Ctercero = sequelize.define('ctercero', {
  seqno: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  codigo: {
    type: DataTypes.STRING(5),
    primaryKey: true,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(128),
    allowNull: false,
  },
  nomaux: {
    type: DataTypes.STRING(128),
  },
  ciftyp: {
    type: DataTypes.STRING(1),
  },
  cif: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  estado: {
    type: DataTypes.CHAR(1),
    allowNull: false,
    defaultValue: 'A',
  },
  fecbaj: {
    type: DataTypes.DATE,
  },
  coment: {
    type: DataTypes.STRING(60),
  },
  user_created: {
    type: DataTypes.STRING(20),
  },
  user_updated: {
    type: DataTypes.STRING(20),
  },
  date_updated: {
    type: DataTypes.DATE,
  },
}, 
{
  freezeTableName: true,
  timestamps: false,
});