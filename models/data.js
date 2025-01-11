'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Data extends Model {
        static associate(models) {
            Data.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });
        }
    }
    Data.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: DataTypes.DATE,
            asset: DataTypes.STRING,
            session: DataTypes.STRING,
            tpSl: DataTypes.STRING,
            pnl: DataTypes.FLOAT,
            pnlPercentage: DataTypes.FLOAT,
            temporalidad: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Data',
            tableName: 'data',
        }
    );
    return Data;
};
