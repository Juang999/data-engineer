const Connection = require('../config/connection.js');
const {SalesOrderRelatedWithShipment} = require('../models');
const moment = require('moment');
const {info, error} = require('../helper/Logging.js');

class SoRelatedWithShipment extends Connection {
    run = async () => {
        try {
            let data = await this.getData();

            if (data.length == 0) return;

            await SalesOrderRelatedWithShipment.bulkCreate(data, {
                logging: (sql) => {

                }
            });

            info({feature: 'sales order related with shipment',message: "INPUT DATA SUCCESSFULLY!", total_data: data.length});
            return;

        } catch (error) {
            error({feature: 'sales order related with shipment', message: error.message, total_data: 0});
            return;
        }
    }

    getData = async () => {
        let time_dimension = await this.getLastDate();
        let data = await this.getDataSalesOrder(time_dimension);

        return data;
    }

    getLastDate = async () => {
            let {dataValues} = await SalesOrderRelatedWithShipment.findOne({
                attributes: [
                    'soship_add_date'
                ],
                order: [
                    ['soship_add_date', 'DESC']
                ],
                logging: (query, sqlCommand) => {

                }
            })

        return dataValues.soship_add_date;
    }

    getDataSalesOrder = async (time_dimension) => {
        let timestamp = moment(time_dimension).format('YYYY-MM-DD HH:mm:ss');

        let [data] = await this.sourceConnection.query(`
                SELECT soship_add_date, 
                en_desc,
                so_code,
                so_date,
                ptnr_mstr.ptnr_name,
                ptnr_mstr.ptnr_code,
                soship_code,
                soship_date,
                si_desc,
                soship_is_shipment,
                soshipd_seq,
                cu_name,
                so_exc_rate,
                pt_code,
                sod_cost,
                pt_desc1,
                pt_desc2,
                sod_taxable,
                sod_tax_inc,
                sod_sales_unit,
                (sod_sales_unit *(- 1) * soshipd_qty) as sod_sales_unit_total,
                tax_mstr.code_name as tax_name,
                soshipd_qty * - 1 as soshipd_qty,
                sod_price,
                soshipd_qty * - 1 * sod_price as sales_ttl,
                sod_disc,
                soshipd_qty * - 1 * sod_cost as total_cost,
                soshipd_qty * - 1 * sod_price * sod_disc as disc_value,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))
                end as price_fp,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price * sod_disc
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc
                end as disc_fp,
                case upper(sod_tax_inc)
                    when 'N' then (soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)
                    when 'Y' then ((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)
                end as dpp,
                case upper(sod_tax_inc)
                    when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                    when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                end as gross_profit,
                pl_desc,
                case pl_code
                    when '990000000001' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then ((((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))) * 0.1
                                            end
                end as ppn_bayar,
                case pl_code
                    when '990000000002' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))
                                            end
                end as ppn_bebas,
                um_mstr.code_name as um_name,
                loc_desc,
                reason_mstr.code_name as reason_name,
                ar_code,
                ar_date,
                ti_code,
                ptnrg_name,
                sales_mstr.ptnr_name as sales_name,
                ti_date,
                pay_type.code_name as pay_type_desc,
                pi_desc,
                case
                    when ptnr_mstr.ptnr_is_ps = 'Y' then 'PS'
                    else 'NON PS'
                end as ps_status
            FROM public.soship_mstr
                inner join soshipd_det on soshipd_soship_oid = soship_oid
                inner join so_mstr on so_oid = soship_so_oid
                inner join pi_mstr on so_pi_id = pi_id
                inner join sod_det on sod_oid = soshipd_sod_oid
                inner join ptnr_mstr sales_mstr on sales_mstr.ptnr_id = so_sales_person
                inner join en_mstr on en_id = soship_en_id
                inner join si_mstr on si_id = soship_si_id
                inner join ptnr_mstr on ptnr_mstr.ptnr_id = so_ptnr_id_sold
                inner join pt_mstr on pt_id = sod_pt_id
                inner join code_mstr as um_mstr on um_mstr.code_id = soshipd_um
                inner join loc_mstr on loc_id = soshipd_loc_id
                inner join cu_mstr on cu_id = so_cu_id
                inner join code_mstr as tax_mstr on tax_mstr.code_id = sod_tax_class
                inner join code_mstr pay_type on pay_type.code_id = so_pay_type
                left outer join code_mstr as reason_mstr on reason_mstr.code_id = soshipd_rea_code_id
                left outer join ars_ship on ars_soshipd_oid = soshipd_oid
                left outer join ar_mstr on ar_oid = ars_ar_oid
                left outer join tia_ar on tia_ar_oid = ar_oid
                left outer join ti_mstr on ti_oid = tia_ti_oid
                left outer join ptnrg_grp on ptnrg_grp.ptnrg_id = ptnr_mstr.ptnr_ptnrg_id
                inner join pl_mstr on pl_id = pt_pl_id
            where soship_add_date > '${timestamp}' and
                pay_type.code_usr_1 <> '0' and
                left (en_desc, 3) <> 'CMD' and
                so_en_id in (
                                select user_en_id
                                from tconfuserentity
                                where userid = 1
                )
            union all
            SELECT soship_add_date, 
                en_desc,
                so_code,
                so_date,
                ptnr_mstr.ptnr_name,
                ptnr_mstr.ptnr_code,
                soship_code,
                soship_date,
                si_desc,
                soship_is_shipment,
                soshipd_seq,
                cu_name,
                so_exc_rate,
                pt_code,
                sod_cost,
                pt_desc1,
                pt_desc2,
                sod_taxable,
                sod_tax_inc,
                sod_sales_unit,
                (sod_sales_unit *(- 1) * soshipd_qty) as sod_sales_unit_total,
                tax_mstr.code_name as tax_name,
                soshipd_qty * - 1 as soshipd_qty,
                sod_price,
                soshipd_qty * - 1 * sod_price as sales_ttl,
                sod_disc,
                soshipd_qty * - 1 * sod_cost as total_cost,
                soshipd_qty * - 1 * sod_price * sod_disc as disc_value,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))
                end as price_fp,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price * sod_disc
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc
                end as disc_fp,
                case upper(sod_tax_inc)
                    when 'N' then (soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)
                    when 'Y' then ((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)
                end as dpp,
                case upper(sod_tax_inc)
                    when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                    when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                end as gross_profit,
                pl_desc,
                case pl_code
                    when '990000000001' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then ((((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))) * 0.1
                                            end
                end as ppn_bayar,
                case pl_code
                    when '990000000002' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))
                                            end
                end as ppn_bebas,
                um_mstr.code_name as um_name,
                loc_desc,
                reason_mstr.code_name as reason_name,
                null as ar_code,
                null as ar_date,
                ti_code,
                ptnrg_name,
                sales_mstr.ptnr_name as sales_name,
                ti_date,
                pay_type.code_name as pay_type_desc,
                pi_desc,
                case
                    when ptnr_mstr.ptnr_is_ps = 'Y' then 'PS'
                    else 'NON PS'
                end as ps_status
            FROM public.soship_mstr
                inner join soshipd_det on soshipd_soship_oid = soship_oid
                inner join so_mstr on so_oid = soship_so_oid
                inner join pi_mstr on so_pi_id = pi_id
                inner join sod_det on sod_oid = soshipd_sod_oid
                inner join ptnr_mstr sales_mstr on sales_mstr.ptnr_id = so_sales_person
                inner join en_mstr on en_id = soship_en_id
                inner join si_mstr on si_id = soship_si_id
                inner join ptnr_mstr on ptnr_mstr.ptnr_id = so_ptnr_id_sold
                inner join pt_mstr on pt_id = sod_pt_id
                inner join code_mstr as um_mstr on um_mstr.code_id = soshipd_um
                inner join loc_mstr on loc_id = soshipd_loc_id
                inner join cu_mstr on cu_id = so_cu_id
                inner join code_mstr as tax_mstr on tax_mstr.code_id = sod_tax_class
                inner join code_mstr pay_type on pay_type.code_id = so_pay_type
                left outer join code_mstr as reason_mstr on reason_mstr.code_id = soshipd_rea_code_id
                left outer join tis_soship on tis_soship_oid = soship_oid
                left outer join ti_mstr on ti_oid = tis_ti_oid
                left outer join ptnrg_grp on ptnrg_grp.ptnrg_id = ptnr_mstr.ptnr_ptnrg_id
                inner join pl_mstr on pl_id = pt_pl_id
            where soship_add_date > '${timestamp}' and
                pay_type.code_usr_1 = '0' and
                so_en_id in (
                                select user_en_id
                                from tconfuserentity
                                where userid = 1
                )
            union all
            SELECT soship_add_date, 
                en_desc,
                so_code,
                so_date,
                ptnr_mstr.ptnr_name,
                ptnr_mstr.ptnr_code,
                soship_code,
                soship_date,
                si_desc,
                soship_is_shipment,
                soshipd_seq,
                cu_name,
                so_exc_rate,
                pt_code,
                sod_cost,
                pt_desc1,
                pt_desc2,
                sod_taxable,
                sod_tax_inc,
                sod_sales_unit,
                (sod_sales_unit *(- 1) * soshipd_qty) as sod_sales_unit_total,
                tax_mstr.code_name as tax_name,
                soshipd_qty * - 1 as soshipd_qty,
                sod_price,
                soshipd_qty * - 1 * sod_price as sales_ttl,
                sod_disc,
                soshipd_qty * - 1 * sod_cost as total_cost,
                soshipd_qty * - 1 * sod_price * sod_disc as disc_value,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))
                end as price_fp,
                case upper(sod_tax_inc)
                    when 'N' then soshipd_qty * - 1 * sod_price * sod_disc
                    when 'Y' then (soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc
                end as disc_fp,
                case upper(sod_tax_inc)
                    when 'N' then (soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)
                    when 'Y' then ((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)
                end as dpp,
                case upper(sod_tax_inc)
                    when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                    when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1 * sod_price) * cast ((100.0
                    / 110.0) as numeric (26, 8)) * sod_disc)) -(soshipd_qty * - 1 * sod_cost)
                end as gross_profit,
                pl_desc,
                case pl_code
                    when '990000000001' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then ((((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))) * 0.1
                                            end
                end as ppn_bayar,
                case pl_code
                    when '990000000002' then case upper(sod_tax_inc)
                                                when 'N' then ((soshipd_qty * - 1 * sod_price) -(soshipd_qty * - 1 * sod_price * sod_disc)) * 0.1
                                                when 'Y' then (((soshipd_qty * - 1 * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8))) -((soshipd_qty * - 1
                                                * sod_price) * cast ((100.0 / 110.0) as numeric (26, 8)) * sod_disc))
                                            end
                end as ppn_bebas,
                um_mstr.code_name as um_name,
                loc_desc,
                reason_mstr.code_name as reason_name,
                null as ar_code,
                null as ar_date,
                ti_code,
                ptnrg_name,
                sales_mstr.ptnr_name as sales_name,
                ti_date,
                pay_type.code_name as pay_type_desc,
                pi_desc,
                case
                    when ptnr_mstr.ptnr_is_ps = 'Y' then 'PS'
                    else 'NON PS'
                end as ps_status
            FROM public.soship_mstr
                inner join soshipd_det on soshipd_soship_oid = soship_oid
                inner join so_mstr on so_oid = soship_so_oid
                inner join pi_mstr on so_pi_id = pi_id
                inner join sod_det on sod_oid = soshipd_sod_oid
                inner join ptnr_mstr sales_mstr on sales_mstr.ptnr_id = so_sales_person
                inner join en_mstr on en_id = soship_en_id
                inner join si_mstr on si_id = soship_si_id
                inner join ptnr_mstr on ptnr_mstr.ptnr_id = so_ptnr_id_sold
                inner join pt_mstr on pt_id = sod_pt_id
                inner join code_mstr as um_mstr on um_mstr.code_id = soshipd_um
                inner join loc_mstr on loc_id = soshipd_loc_id
                inner join cu_mstr on cu_id = so_cu_id
                inner join code_mstr as tax_mstr on tax_mstr.code_id = sod_tax_class
                inner join code_mstr pay_type on pay_type.code_id = so_pay_type
                left outer join code_mstr as reason_mstr on reason_mstr.code_id = soshipd_rea_code_id
                left outer join tis_soship on tis_soship_oid = soship_oid
                left outer join ti_mstr on ti_oid = tis_ti_oid
                left outer join ptnrg_grp on ptnrg_grp.ptnrg_id = ptnr_mstr.ptnr_ptnrg_id
                inner join pl_mstr on pl_id = pt_pl_id
            where soship_add_date > '${timestamp}' and
                pay_type.code_usr_1 <> '0' and
                left (en_desc, 3) = 'CMD' and
                so_en_id in (
                                select user_en_id
                                from tconfuserentity
                                where userid = 1
                )
            `, {
                logging: (sql) => {
                    
                }
            })

        return data;
    }
}

let ClassSalesOrderRelatedWithShipment = new SoRelatedWithShipment();
ClassSalesOrderRelatedWithShipment.run();