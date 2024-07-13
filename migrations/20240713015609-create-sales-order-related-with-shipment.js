'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SalesOrderRelatedWithShipments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      soship_add_date: {
        type: Sequelize.DATE
      },
      en_desc: {
        type: Sequelize.STRING
      },
      so_code: {
        type: Sequelize.STRING
      },
      so_date: {
        type: Sequelize.DATE
      },
      ptnr_name: {
        type: Sequelize.STRING
      },
      ptnr_code: {
        type: Sequelize.STRING
      },
      soship_code: {
        type: Sequelize.STRING
      },
      soship_date: {
        type: Sequelize.DATE
      },
      si_desc: {
        type: Sequelize.STRING
      },
      soship_is_shipment: {
        type: Sequelize.STRING
      },
      soshipd_seq: {
        type: Sequelize.INTEGER
      },
      cu_name: {
        type: Sequelize.STRING
      },
      so_exc_rate: {
        type: Sequelize.INTEGER
      },
      pt_code: {
        type: Sequelize.STRING
      },
      sod_cost: {
        type: Sequelize.STRING
      },
      pt_desc1: {
        type: Sequelize.STRING
      },
      pt_desc2: {
        type: Sequelize.STRING
      },
      sod_taxable: {
        type: Sequelize.STRING
      },
      sod_tax_inc: {
        type: Sequelize.STRING
      },
      sod_sales_unit: {
        type: Sequelize.INTEGER
      },
      sod_sales_unit_total: {
        type: Sequelize.INTEGER
      },
      tax_name: {
        type: Sequelize.STRING
      },
      soshipd_qty: {
        type: Sequelize.INTEGER
      },
      sod_price: {
        type: Sequelize.INTEGER
      },
      sales_ttl: {
        type: Sequelize.INTEGER
      },
      sod_disc: {
        type: Sequelize.INTEGER
      },
      total_cost: {
        type: Sequelize.INTEGER
      },
      disc_value: {
        type: Sequelize.INTEGER
      },
      price_fp: {
        type: Sequelize.INTEGER
      },
      dpp: {
        type: Sequelize.INTEGER
      },
      gross_profit: {
        type: Sequelize.INTEGER
      },
      pl_desc: {
        type: Sequelize.STRING
      },
      ppn_bayar: {
        type: Sequelize.INTEGER
      },
      ppn_bebas: {
        type: Sequelize.INTEGER
      },
      um_name: {
        type: Sequelize.STRING
      },
      loc_desc: {
        type: Sequelize.STRING
      },
      reason_name: {
        type: Sequelize.STRING
      },
      ar_code: {
        type: Sequelize.STRING
      },
      ar_date: {
        type: Sequelize.DATE
      },
      ti_code: {
        type: Sequelize.STRING
      },
      ptnrg_name: {
        type: Sequelize.STRING
      },
      sales_name: {
        type: Sequelize.STRING
      },
      ti_date: {
        type: Sequelize.DATE
      },
      pay_type_desc: {
        type: Sequelize.STRING
      },
      pi_desc: {
        type: Sequelize.STRING
      },
      ps_status: {
        type: Sequelize.STRING
      },
      disc_fp: {
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
    await queryInterface.dropTable('SalesOrderRelatedWithShipments');
  }
};