'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('data', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      day: {
        type: Sequelize.STRING,
      },
      open: {
        type: Sequelize.TIME,
      },
      close: {
        type: Sequelize.TIME,
      },
      asset: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      session: {
        type: Sequelize.STRING,
      },
      buySell: {
        type: Sequelize.STRING,
      },
      lots: {
        type: Sequelize.FLOAT,
      },
      tpSlBe: {
        type: Sequelize.STRING,
      },
      pnl: {
        type: Sequelize.FLOAT,
      },
      pnlPercentage: {
        type: Sequelize.FLOAT,
      },
      ratio: {
        type: Sequelize.STRING,
      },
      risk: {
        type: Sequelize.FLOAT,
      },
      temporalidad: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('data');
  },
};

