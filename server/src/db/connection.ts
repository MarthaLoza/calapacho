import { Sequelize } from "sequelize";

const sequelize = new Sequelize('calapacho', 'postgres', 'd31st3r', {
    host: 'localhost',
    dialect: 'postgres',
});

export default sequelize;