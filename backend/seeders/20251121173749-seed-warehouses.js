'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Warehouses', [
      {
        name: 'Warehouse A',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Warehouse B',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Warehouse C',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Warehouses', null, {});
  }
};
