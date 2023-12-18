const Sequelize = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
    process.env.DB,
    process.env.USER,
    process.env.PASSWORD,
    {
        host: process.env.HOST,
        dialect: 'postgres',
    }
);

module.exports = sequelize;