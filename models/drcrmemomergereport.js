'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DRCRMemoMergeReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DRCRMemoMergeReport.init({
    time_dimension: {
      type: DataTypes.DATE,
      primaryKey: true,
    },
    entity: DataTypes.STRING,
    merge_number: DataTypes.STRING,
    merge_date: DataTypes.DATEONLY,
    invoice_number: DataTypes.STRING,
    effective_date: DataTypes.DATEONLY,
    so_number: DataTypes.STRING,
    so_date: DataTypes.DATEONLY,
    customer: DataTypes.STRING,
    shipment: DataTypes.INTEGER,
    um: DataTypes.STRING,
    price: DataTypes.INTEGER,
    disc: DataTypes.INTEGER,
    price_after_disc: DataTypes.INTEGER,
    price_before_disc: DataTypes.INTEGER,
    total_disc: DataTypes.INTEGER,
    invoiced: DataTypes.INTEGER,
    remarks: DataTypes.STRING
  }, {
    sequelize,
    schema: 'public',
    tableName: 'drcr_memo_merge_report',
    timestamps: false,
    modelName: 'DRCRMemoMergeReport',
  });
  return DRCRMemoMergeReport;
};