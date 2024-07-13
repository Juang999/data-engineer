'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesOrderRelatedWithShipment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SalesOrderRelatedWithShipment.init({
    soship_add_date: {
      type: DataTypes.DATE,
      primaryKey: true
    },
    en_desc: DataTypes.STRING,
    so_code: DataTypes.STRING,
    so_date: DataTypes.DATE,
    ptnr_name: DataTypes.STRING,
    ptnr_code: DataTypes.STRING,
    soship_code: DataTypes.STRING,
    soship_date: DataTypes.DATE,
    si_desc: DataTypes.STRING,
    soship_is_shipment: DataTypes.STRING,
    soshipd_seq: DataTypes.INTEGER,
    cu_name: DataTypes.STRING,
    so_exc_rate: DataTypes.INTEGER,
    pt_code: DataTypes.STRING,
    sod_cost: DataTypes.STRING,
    pt_desc1: DataTypes.STRING,
    pt_desc2: DataTypes.STRING,
    sod_taxable: DataTypes.STRING,
    sod_tax_inc: DataTypes.STRING,
    sod_sales_unit: DataTypes.INTEGER,
    sod_sales_unit_total: DataTypes.INTEGER,
    tax_name: DataTypes.STRING,
    soshipd_qty: DataTypes.INTEGER,
    sod_price: DataTypes.INTEGER,
    sales_ttl: DataTypes.INTEGER,
    sod_disc: DataTypes.INTEGER,
    total_cost: DataTypes.INTEGER,
    disc_value: DataTypes.INTEGER,
    price_fp: DataTypes.INTEGER,
    dpp: DataTypes.INTEGER,
    gross_profit: DataTypes.INTEGER,
    pl_desc: DataTypes.STRING,
    ppn_bayar: DataTypes.INTEGER,
    ppn_bebas: DataTypes.INTEGER,
    um_name: DataTypes.STRING,
    loc_desc: DataTypes.STRING,
    reason_name: DataTypes.STRING,
    ar_code: DataTypes.STRING,
    ar_date: DataTypes.DATE,
    ti_code: DataTypes.STRING,
    ptnrg_name: DataTypes.STRING,
    sales_name: DataTypes.STRING,
    ti_date: DataTypes.DATE,
    pay_type_desc: DataTypes.STRING,
    pi_desc: DataTypes.STRING,
    ps_status: DataTypes.STRING,
    disc_fp: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    timestamps: false,
    tableName: 'so_related_with_shipment',
    modelName: 'SalesOrderRelatedWithShipment',
  });
  return SalesOrderRelatedWithShipment;
};