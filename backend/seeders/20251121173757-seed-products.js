'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Products', [
      {
        name: 'Icy Mint',
        sku: 'ICYMINT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Choco Delight',
        sku: 'CHOCODELIGHT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vanilla Dream',
        sku: 'VANILLADREAM',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Products', null, {});
  }
};
