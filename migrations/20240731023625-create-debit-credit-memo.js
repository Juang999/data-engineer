'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DebitCreditMemos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ar_add_date: {
        type: Sequelize.DATE
      },
      ar_dom_id: {
        type: Sequelize.INTEGER
      },
      ar_en_id: {
        type: Sequelize.INTEGER
      },
      ar_add_by: {
        type: Sequelize.STRING
      },
      ar_upd_by: {
        type: Sequelize.STRING
      },
      ar_upd_date: {
        type: Sequelize.DATE
      },
      ar_code: {
        type: Sequelize.STRING
      },
      ar_date: {
        type: Sequelize.DATEONLY
      },
      ar_bill_to: {
        type: Sequelize.INTEGER
      },
      ar_cu_id: {
        type: Sequelize.INTEGER
      },
      ar_exc_rate: {
        type: Sequelize.INTEGER
      },
      ar_credit_term: {
        type: Sequelize.INTEGER
      },
      ar_eff_date: {
        type: Sequelize.DATE
      },
      ar_disc_date: {
        type: Sequelize.DATE
      },
      ar_expt_date: {
        type: Sequelize.DATE
      },
      ar_ac_id: {
        type: Sequelize.INTEGER
      },
      ar_sb_id: {
        type: Sequelize.INTEGER
      },
      ar_cc_id: {
        type: Sequelize.INTEGER
      },
      ar_type: {
        type: Sequelize.INTEGER
      },
      ar_taxable: {
        type: Sequelize.STRING
      },
      ar_tax_inc: {
        type: Sequelize.STRING
      },
      ar_tax_class_id: {
        type: Sequelize.INTEGER
      },
      ar_shipping_charges: {
        type: Sequelize.INTEGER
      },
      ar_total_final: {
        type: Sequelize.INTEGER
      },
      ar_pay_prepaid: {
        type: Sequelize.INTEGER
      },
      ar_pay_prepaid_idr: {
        type: Sequelize.INTEGER
      },
      ar_ac_prepaid: {
        type: Sequelize.INTEGER
      },
      ar_code_prepaid: {
        type: Sequelize.STRING
      },
      ar_name_prepaid: {
        type: Sequelize.STRING
      },
      ar_amount: {
        type: Sequelize.INTEGER
      },
      ar_pay_amount: {
        type: Sequelize.INTEGER
      },
      ar_outstanding: {
        type: Sequelize.INTEGER
      },
      ar_amount_idr: {
        type: Sequelize.STRING
      },
      ar_pay_amount_idr: {
        type: Sequelize.INTEGER
      },
      ar_outstanding_idr: {
        type: Sequelize.INTEGER
      },
      ar_remarks: {
        type: Sequelize.STRING
      },
      ar_status: {
        type: Sequelize.STRING
      },
      ar_dt: {
        type: Sequelize.DATE
      },
      ar_due_date: {
        type: Sequelize.DATE
      },
      en_desc: {
        type: Sequelize.STRING
      },
      ptnr_name: {
        type: Sequelize.STRING
      },
      cu_name: {
        type: Sequelize.STRING
      },
      credit_terms_name: {
        type: Sequelize.STRING
      },
      ac_code: {
        type: Sequelize.STRING
      },
      ac_name: {
        type: Sequelize.STRING
      },
      sb_desc: {
        type: Sequelize.STRING
      },
      cc_desc: {
        type: Sequelize.STRING
      },
      ar_bk_id: {
        type: Sequelize.INTEGER
      },
      bk_name: {
        type: Sequelize.STRING
      },
      ar_ppn_type: {
        type: Sequelize.STRING
      },
      ar_type_name: {
        type: Sequelize.STRING
      },
      taxclass_name: {
        type: Sequelize.STRING
      },
      ac_code_prepaid: {
        type: Sequelize.STRING
      },
      ac_name_prepaid: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('DebitCreditMemos');
  }
};