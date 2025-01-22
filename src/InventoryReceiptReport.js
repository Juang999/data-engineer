const moment = require('moment');
const Connection = require('../config/connection.js');
const {InventoryReceiptReport} = require('../models')
const {info, error: errorLog} = require('../helper/Logging.js');

class ReportInventoryReceipt extends Connection {
    run = async () => {
        try {
            let result = await this.extractData();
    
            if (result.length > 0) {
                await this.loadData(result);
                info({feature: 'INVENTORY RECEIPT REPORT', message: 'batch input successfully', total_data: result.length})
            }

            info({feature: 'INVENTORY RECEIPT REPORT', message: 'executed!', total_data: result.length})
        } catch (error) {
            errorLog({feature: 'INVENTORY RECEIPT REPORT', message: error.message})
        }
    }

    extractData = async () => {
        let {dataValues} = await this.helperExtractGetLastTimestamp();
        let [data] = await this.sourceConnection.query(`
                SELECT   
                    public.en_mstr.en_desc as entity,   
                    public.riud_det.riud_dt as receipt_date,
                    public.pt_mstr.pt_code as partnumber,
                    public.pt_mstr.pt_desc1 as pt_desc1,    
                    public.riud_det.riud_qty as qty_receipt,
                    code_name as um,   
                    public.loc_mstr.loc_desc as location,   
                    public.riu_mstr.riu_remarks as remarks,
                    public.riu_mstr.riu_type2 as receipt_code
                from public.riud_det 
                INNER JOIN public.riu_mstr ON (public.riud_det.riud_riu_oid = public.riu_mstr.riu_oid)   
                INNER JOIN public.loc_mstr ON (public.riud_det.riud_loc_id = public.loc_mstr.loc_id)   
                INNER JOIN public.pt_mstr ON (public.riud_det.riud_pt_id = public.pt_mstr.pt_id)   
                INNER JOIN public.code_mstr ON (public.riud_det.riud_um = public.code_mstr.code_id)   
                LEFT OUTER JOIN public.en_mstr ON (public.riu_mstr.riu_en_id = public.en_mstr.en_id)  
                where riu_mstr.riu_date > :timestamp   
                and riu_mstr.riu_type ~~* 'R'  and riu_en_id in (select user_en_id from tconfuserentity   where userid = 1)  
                order by  public.riud_det.riud_dt ASC 
            `, {
                replacements: {
                    timestamp: moment(dataValues.receipt_code).format('YYYY-MM-DD HH:mm:ss'),
                },
                logging: false
            })

        return data;
    }

    loadData = async (data) => {
        await InventoryReceiptReport.bulkCreate(data);
    }

    helperExtractGetLastTimestamp = async () => {
        let data = await InventoryReceiptReport.findOne({
            attributes: ['receipt_date'],
            order: [['receipt_date', 'DESC']],
            logging: false
        });

        return data;
    }
}

let Engine = new ReportInventoryReceipt();
Engine.run();