'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InventoryReceiptReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InventoryReceiptReport.init({
    entity: DataTypes.STRING,
    receipt_date: DataTypes.DATE,
    partnumber: DataTypes.STRING,
    pt_desc1: DataTypes.STRING,
    qty_receipt: DataTypes.INTEGER,
    um: DataTypes.STRING,
    location: DataTypes.STRING,
    remarks: DataTypes.STRING,
    receipt_code: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  }, {
    sequelize,
    schema: 'public',
    timestamps: false,
    tableName: 'inventory_receipt_report',
    modelName: 'InventoryReceiptReport',
  });
  return InventoryReceiptReport;
};