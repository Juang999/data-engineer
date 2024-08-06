'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('InventoryReportDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invc_oid: {
        type: Sequelize.UUID
      },
      invc_dom_id: {
        type: Sequelize.INTEGER
      },
      invc_en_id: {
        type: Sequelize.INTEGER
      },
      invc_loc_id: {
        type: Sequelize.INTEGER
      },
      invc_pt_id: {
        type: Sequelize.INTEGER
      },
      invc_serial: {
        type: Sequelize.STRING
      },
      invc_qty_sum: {
        type: Sequelize.INTEGER
      },
      invc_qty_booked: {
        type: Sequelize.INTEGER
      },
      invc_qty_available: {
        type: Sequelize.INTEGER
      },
      invc_qty_alloc_sum: {
        type: Sequelize.INTEGER
      },
      invc_qty_open: {
        type: Sequelize.INTEGER
      },
      en_desc: {
        type: Sequelize.STRING
      },
      si_desc: {
        type: Sequelize.STRING
      },
      loc_desc: {
        type: Sequelize.STRING
      },
      pt_code: {
        type: Sequelize.STRING
      },
      pt_desc1: {
        type: Sequelize.STRING
      },
      pt_desc2: {
        type: Sequelize.STRING
      },
      pl_desc: {
        type: Sequelize.STRING
      },
      pt_cost: {
        type: Sequelize.INTEGER
      },
      invct_cost: {
        type: Sequelize.INTEGER
      },
      invct_cost_ext: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      price_ext: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('InventoryReportDetails');
  }
};