'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DebitCreditMemo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DebitCreditMemo.init({
    ar_add_date: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    ar_dom_id: DataTypes.INTEGER,
    ar_en_id: DataTypes.INTEGER,
    ar_add_by: DataTypes.STRING,
    ar_upd_by: DataTypes.STRING,
    ar_upd_date: DataTypes.DATE,
    ar_code: DataTypes.STRING,
    ar_date: DataTypes.DATEONLY,
    ar_bill_to: DataTypes.INTEGER,
    ar_cu_id: DataTypes.INTEGER,
    ar_exc_rate: DataTypes.INTEGER,
    ar_credit_term: DataTypes.INTEGER,
    ar_eff_date: DataTypes.DATE,
    ar_disc_date: DataTypes.DATE,
    ar_expt_date: DataTypes.DATE,
    ar_ac_id: DataTypes.INTEGER,
    ar_sb_id: DataTypes.INTEGER,
    ar_cc_id: DataTypes.INTEGER,
    ar_type: DataTypes.INTEGER,
    ar_taxable: DataTypes.STRING,
    ar_tax_inc: DataTypes.STRING,
    ar_tax_class_id: DataTypes.INTEGER,
    ar_shipping_charges: DataTypes.INTEGER,
    ar_total_final: DataTypes.INTEGER,
    ar_pay_prepaid: DataTypes.INTEGER,
    ar_pay_prepaid_idr: DataTypes.INTEGER,
    ar_ac_prepaid: DataTypes.INTEGER,
    ar_code_prepaid: DataTypes.STRING,
    ar_name_prepaid: DataTypes.STRING,
    ar_amount: DataTypes.INTEGER,
    ar_pay_amount: DataTypes.INTEGER,
    ar_outstanding: DataTypes.INTEGER,
    ar_amount_idr: DataTypes.STRING,
    ar_pay_amount_idr: DataTypes.INTEGER,
    ar_outstanding_idr: DataTypes.INTEGER,
    ar_remarks: DataTypes.STRING,
    ar_status: DataTypes.STRING,
    ar_dt: DataTypes.DATE,
    ar_due_date: DataTypes.DATE,
    en_desc: DataTypes.STRING,
    ptnr_name: DataTypes.STRING,
    cu_name: DataTypes.STRING,
    credit_terms_name: DataTypes.STRING,
    ac_code: DataTypes.STRING,
    ac_name: DataTypes.STRING,
    sb_desc: DataTypes.STRING,
    cc_desc: DataTypes.STRING,
    ar_bk_id: DataTypes.INTEGER,
    bk_name: DataTypes.STRING,
    ar_ppn_type: DataTypes.STRING,
    ar_type_name: DataTypes.STRING,
    taxclass_name: DataTypes.STRING,
    ac_code_prepaid: DataTypes.STRING,
    ac_name_prepaid: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'debit_or_credit_memo',
    modelName: 'DebitCreditMemo',
    timestamps: false
  });
  return DebitCreditMemo;
};