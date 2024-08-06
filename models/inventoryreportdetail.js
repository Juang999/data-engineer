'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryReportDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InventoryReportDetail.init({
    invc_oid: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    invc_dom_id: DataTypes.INTEGER,
    invc_en_id: DataTypes.INTEGER,
    invc_loc_id: DataTypes.INTEGER,
    invc_pt_id: DataTypes.INTEGER,
    invc_serial: DataTypes.STRING,
    invc_qty_sum: DataTypes.INTEGER,
    invc_qty_booked: DataTypes.INTEGER,
    invc_qty_available: DataTypes.INTEGER,
    invc_qty_alloc_sum: DataTypes.INTEGER,
    invc_qty_open: DataTypes.INTEGER,
    en_desc: DataTypes.STRING,
    si_desc: DataTypes.STRING,
    loc_desc: DataTypes.STRING,
    pt_code: DataTypes.STRING,
    pt_desc1: DataTypes.STRING,
    pt_desc2: DataTypes.STRING,
    pl_desc: DataTypes.STRING,
    pt_cost: DataTypes.INTEGER,
    invct_cost: DataTypes.INTEGER,
    invct_cost_ext: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    price_ext: DataTypes.INTEGER
  }, {
    sequelize,
    schema: 'public',
    tableName: 'inventory_report_detail',
    timestamps: false,
    modelName: 'InventoryReportDetail',
  });
  return InventoryReportDetail;
};