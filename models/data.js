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
            date: {
                type: DataTypes.DATEONLY, // Almacena solo la fecha
                allowNull: false,
            },
            day: {
                type: DataTypes.STRING, // Días como "Sunday", "Monday"
            },
            open: {
                type: DataTypes.TIME, // Formato de hora: '00:03'
            },
            close: {
                type: DataTypes.TIME, // Formato de hora: '02:00'
            },
            asset: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            session: {
                type: DataTypes.STRING,
            },
            buySell: {
                type: DataTypes.STRING, // Valores como "BUY" o "SELL"
            },
            lots: {
                type: DataTypes.FLOAT, // Tamaño de las posiciones
            },
            tpSlBe: {
                type: DataTypes.STRING, // Valores como "TP", "SL", "BE"
            },
            pnl: {
                type: DataTypes.FLOAT, // Pérdida o ganancia
            },
            pnlPercentage: {
                type: DataTypes.FLOAT, // P&L en porcentaje
            },
            ratio: {
                type: DataTypes.STRING, // Ratio como "1", "1.5", etc.
            },
            risk: {
                type: DataTypes.FLOAT, // Nivel de riesgo
            },
            temporalidad: {
                type: DataTypes.STRING, // Valores como "M1", "M5", etc.
            },
        },
        {
            sequelize,
            modelName: 'Data',
            tableName: 'data',
        }
    );

    return Data;
};
