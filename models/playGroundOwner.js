const sequelize = require('../models/index');
const Sequelize = require('sequelize');


const playGroundOwner = sequelize.define('playGroundOwner', {
    id: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    Fname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    Lname: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },

    email: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    password: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    status: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        required: true
    },
    birth_date: {
        type: Sequelize.DataTypes.DATEONLY
    },
    phone_number: {
        type: Sequelize.DataTypes.STRING
    },
    address: {
        type: Sequelize.DataTypes.STRING
    }
});

module.exports = playGroundOwner;