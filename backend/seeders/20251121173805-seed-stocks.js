'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Stocks', [
      {
        warehouse_id: 1,
        product_id: 1,
        quantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        warehouse_id: 2,
        product_id: 1,
        quantity: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Stocks', null, {});
  }
};
