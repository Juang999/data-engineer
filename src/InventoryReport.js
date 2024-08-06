const moment = require('moment');
const Connection = require('../config/connection.js');
const {info, error: errorLog} = require('../helper/Logging.js');
const {InventoryReportDetail} = require('../models/index.js');

class InventoryReport extends Connection {
    run = async () => {
        try {
            let getDataInventory = await this.getData();

            this.checkData(getDataInventory);
        } catch (error) {
            errorLog({feature: 'INVENTORY REPORT DETAIL',message: error.message, total_data: 0})
        }
    }

    getData = async () => {
        let [data] = await this.sourceConnection.query(`
                SELECT
                    invc_oid,
                    invc_dom_id,
                    invc_en_id,
                    invc_si_id,
                    invc_loc_id,
                    invc_pt_id,
                    invc_serial,
                    invc_qty as invc_qty_sum,
                    invc_qty_booked,
                    invc_qty_available,
                    invc_qty_alloc as invc_qty_alloc_sum,
                    coalesce(public.invc_mstr.invc_qty,0) + coalesce(public.invc_mstr.invc_qty_alloc,0) + coalesce(public.invc_mstr.invc_qty_booked,0) as invc_qty_open,
                    en_desc,
                    si_desc,
                    loc_desc,
                    pt_code,
                    pt_desc1,
                    pt_desc2,
                    pl_desc,
                    pt_cost,
                    invct_cost,
                    (invc_qty * invct_cost) as invct_cost_ext,coalesce(price,0) as price, (coalesce(price,0) * invc_qty) as price_ext
                FROM
                invc_mstr
                inner join en_mstr on en_id = invc_en_id
                inner join si_mstr on si_id = invc_si_id
                inner join loc_mstr on loc_id = invc_loc_id
                inner join pt_mstr on pt_id = invc_pt_id
                inner join pl_mstr on pt_pl_id = pl_id
                Left outer join invct_table on invct_pt_id = invc_pt_id
                Left outer JOIN (
                            select 
                                distinct pid_pt_id,
                                price 
                            from public.pid_det 
                            inner join pi_mstr on (pi_oid=pid_pi_oid) 
                            inner join (
                                    select 
                                    distinct pidd_pid_oid, 
                                    max(pidd_price) as price 
                            from public.pidd_det 
                            group by pidd_det.pidd_pid_oid) as pidd_det_temp 
                            on pidd_pid_oid=pid_oid where pi_id = 1031 
                        ) as pid_det_temp on pid_pt_id=pt_id
            `, {
                logging: (sql, querycommand) => {
                    
                }
            })
        
        return data;
    }

    checkData = async (bulkData) => {
        bulkData.forEach(async (element) => {
            let {status, data} = await this.checkStatusData(element.invc_oid);

            if (status == false) {
                await this.createData(element)
                info({feature: 'DETAIL INVENTORY RECEIPT',message: 'DATA CREATED!', total_data: 1});
            } else {
                if (
                    element.invc_qty_sum != data.dataValues.invc_qty_sum ||
                    element.invc_qty_booked != data.dataValues.invc_qty_booked ||
                    element.invc_qty_available != data.dataValues.invc_qty_available ||
                    element.invc_qty_alloc_sum != data.dataValues.invc_qty_alloc_sum ||
                    element.invc_qty_open != data.dataValues.invc_qty_open
                ) {
                    await this.updateData(element);
                    info({feature: 'DETAIL INVENTORY RECEIPT',message: 'DATA UPDATED!', total_data: 1});
                }
            }
        });
    }

    checkStatusData = async (invcOid) => {
        let data = await InventoryReportDetail.findByPk(invcOid, {
            attributes: [
                'invc_oid',
                'invc_qty_sum',
                'invc_qty_booked',
                'invc_qty_available',
                'invc_qty_alloc_sum',
                'invc_qty_open',
            ],
            logging: (sql) => {

            }
        })

        return {
            status: (data) ? true : false,
            data
        };
    }

    createData = async (data) => {
        await InventoryReportDetail.bulkCreate([data], {
            logging: (sql) => {

            }
        });
    }

    updateData = async (data) => {
        await InventoryReportDetail.update({
            invc_qty_sum: data.invc_qty_sum,
            invc_qty_booked: data.invc_qty_booked,
            invc_qty_available: data.invc_qty_available,
            invc_qty_alloc_sum: data.invc_qty_alloc_sum,
            invc_qty_open: data.invc_qty_open,
        }, {
            where: {
                invc_oid: data.invc_oid
            },
            logging: (sql, queryCommand) => {

            }
        });
    }
}

let ClassInventoryReportDetail = new InventoryReport();
ClassInventoryReportDetail.run();