const moment = require('moment');
const {DRCRMemoMergeReport} = require('../models')
const Connection = require('../config/connection.js');
const {info, error: errorLog} = require('../helper/Logging.js');

class DRCRMergeMemoReport extends Connection {
    start = async () => {
        try {
            let {time_dimension: lastTimeStamp} = await this.getLastTimeStamp();
            let timeStamp = moment(lastTimeStamp).format('YYYY-MM-DD HH:mm:ss');
    
            let newData = await this.getNewData(timeStamp);
            if (newData[0].length != 0) {
                console.info('hello world')

                let [bulkData] = newData;
                await this.createData(bulkData);
                info({feature: "DRCR MEMO MERGE REPORT", message: "success", total_data: bulkData.length})
            } 
            info({feature: "DRCR MEMO MERGE REPORT", message: "executed", total_data: newData[0].length})
        } catch (error) {
            info({feature: "DRCR MEMO MERGE REPORT", message: error.message, total_data: 0})
        }
    }

    getLastTimeStamp = async () => {
        let {dataValues} = await DRCRMemoMergeReport.findOne({
            attributes: ['time_dimension'],
            order: [['time_dimension', 'DESC']]
        })

        console.info(dataValues)

        return dataValues;
    }

    getNewData = async (timestamp) => {
        let result = await this.sourceConnection.query(`
            SELECT  
                ar_add_date as time_dimension, 
                en_desc as entity, 
                arp_code as merge_number, 
                arp_date as merge_date, 
                ar_code as invoice_number, 
                ar_eff_date as effective_date,
                arso_so_code as so_number, 
                arso_so_date as so_date,
                ptnr_name as customer,
                sum(ars_shipment) AS shipment,
                um_master.code_name as um,
                ars_so_price AS price,
                sod_disc AS disc,
                ars_invoice_price AS price_after_disc,
                sum(ars_shipment * ars_so_price) AS price_before_disc,
                sum(ars_shipment * ars_so_disc_value) AS total_disc,
                sum(ars_shipment * ars_invoice_price) AS invoiced,
                arp_remarks as remarks
            FROM ar_mstr 
            INNER JOIN public.en_mstr ON (public.ar_mstr.ar_en_id = public.en_mstr.en_id) 
            INNER JOIN public.arso_so ON (public.ar_mstr.ar_oid = public.arso_so.arso_ar_oid) 
            INNER JOIN arpd_det ON arpd_ar_oid = ar_oid 
            INNER JOIN arp_print ON arp_oid = arpd_arp_oid 
            INNER JOIN ars_ship ON ars_ar_oid = ar_oid 
            INNER JOIN soshipd_det ON soshipd_oid = ars_soshipd_oid 
            INNER JOIN soship_mstr ON soship_oid = soshipd_soship_oid 
            INNER JOIN sod_det ON sod_oid = soshipd_sod_oid 
            INNER JOIN so_mstr ON so_oid = sod_so_oid AND (so_oid = soship_so_oid) 
            INNER JOIN pt_mstr ON pt_id = sod_pt_id 
            INNER JOIN ptnr_mstr ON ptnr_id = ar_bill_to 
            INNER JOIN ptnra_addr ON ptnra_ptnr_oid = ptnr_oid 
            INNER JOIN cu_mstr ON cu_id = ar_cu_id 
            inner join code_mstr um_master on um_master.code_id = sod_um 
            inner join bk_mstr on bk_id = ar_bk_id 
            inner join ac_mstr on ac_id = bk_ac_id 
            inner join code_mstr credit_term_mstr on credit_term_mstr.code_id = ar_credit_term 
            inner join cmaddr_mstr on cmaddr_en_id = ar_en_id 
            WHERE soship_mstr.soship_code NOT LIKE 'ST%'  
            and ar_add_date > :time_dimension 
            and arp_en_id in (select user_en_id from tconfuserentity  where userid = 1)
            GROUP BY 
                pt_desc1,
                time_dimension,
                entity,
                merge_number,
                merge_date,
                invoice_number,
                effective_date,
                arso_so_code,
                arso_so_date,
                customer,
                um,
                price,
                disc,
                price_after_disc,
                remarks
            ORDER BY pt_desc1
            `, {
                replacements: {time_dimension: timestamp},
                // logging: false
            })

        return result;
    }

    createData = async (data) => {
        await DRCRMemoMergeReport.bulkCreate(data, {
            logging: false
        })
    }
}

let DRCRMergeMemoReportScript = new DRCRMergeMemoReport();
DRCRMergeMemoReportScript.start();