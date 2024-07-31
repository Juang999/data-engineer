const moment = require('moment');
const {DebitCreditMemo} = require('../models')
const Connection = require('../config/connection.js');
const {info, error} = require('../helper/Logging.js');

class CreditDebitMemo extends Connection {
    run = async () => {
        try {
            let dataAccountReceivable = await this.getDataAccountReceivable();

            if (dataAccountReceivable.length == 0) {
                info({feature: 'credit debit memo', message: "DATA EQUAL!", total_data: 0});
                return;
            }

            await DebitCreditMemo.bulkCreate(dataAccountReceivable, {
                logging: (sql) => {

                }
            });

            info({feature: 'credit debit memo',message: 'INPUT DATA SUCCESSFULLY!', total_data: dataAccountReceivable.length});
        } catch (error) {
            error({feature: 'credit debit memo', message: error.message, total_data: 0})
        }
    }

    getLastTimestamp = async () => {
        let {ar_add_date: last_timestamp} = await DebitCreditMemo.findOne({
            attribute: [
                'ar_add_date'
            ],
            order: [
                ['ar_add_date', 'DESC']
            ],
            logging: (query, sqlCommand) => {

            }
        })

        return last_timestamp;
    }

    getDataAccountReceivable = async () => {
        let lastTimestamp = moment(await this.getLastTimestamp()).format('YYYY-MM-DD HH:mm:ss');

        let [data] = await this.sourceConnection.query(`
                select
                    public.ar_mstr.ar_add_date,
                    public.ar_mstr.ar_dom_id,
                    public.ar_mstr.ar_en_id,
                    public.ar_mstr.ar_add_by,
                    public.ar_mstr.ar_upd_by,
                    public.ar_mstr.ar_upd_date,
                    public.ar_mstr.ar_code,
                    public.ar_mstr.ar_date,
                    public.ar_mstr.ar_bill_to,
                    public.ar_mstr.ar_cu_id,
                    public.ar_mstr.ar_exc_rate,
                    public.ar_mstr.ar_credit_term,
                    public.ar_mstr.ar_eff_date,
                    public.ar_mstr.ar_disc_date,
                    public.ar_mstr.ar_expt_date,
                    public.ar_mstr.ar_ac_id,
                    public.ar_mstr.ar_sb_id,
                    public.ar_mstr.ar_cc_id,
                    public.ar_mstr.ar_type,
                    public.ar_mstr.ar_taxable,
                    public.ar_mstr.ar_tax_inc,
                    public.ar_mstr.ar_tax_class_id,ar_shipping_charges,ar_total_final,
                    public.ar_mstr.ar_pay_prepaid,
                    public.ar_mstr.ar_pay_prepaid * ar_exc_rate as ar_pay_prepaid_idr,
                    public.ar_mstr.ar_ac_prepaid,
                    ac_mstr_prepaid.ac_code as ac_code_prepaid,
                    ac_mstr_prepaid.ac_name as ac_name_prepaid,
                    public.ar_mstr.ar_amount,
                    public.ar_mstr.ar_pay_amount,
                    public.ar_mstr.ar_amount - public.ar_mstr.ar_pay_amount as ar_outstanding,
                    public.ar_mstr.ar_amount * ar_exc_rate as ar_amount_idr,
                    public.ar_mstr.ar_pay_amount * ar_exc_rate as ar_pay_amount_idr,
                    (public.ar_mstr.ar_amount - public.ar_mstr.ar_pay_amount) * ar_exc_rate as ar_outstanding_idr,
                    public.ar_mstr.ar_remarks,
                    public.ar_mstr.ar_status,
                    public.ar_mstr.ar_dt,
                    public.ar_mstr.ar_due_date,
                    public.en_mstr.en_desc,
                    public.ptnr_mstr.ptnr_name,
                    public.cu_mstr.cu_name,
                    credit_term_mstr.code_name as credit_terms_name,
                    public.ac_mstr.ac_code,
                    public.ac_mstr.ac_name,
                    public.sb_mstr.sb_desc,
                    public.cc_mstr.cc_desc,
                    public.ar_mstr.ar_bk_id,
                    public.bk_mstr.bk_name,
                    coalesce(ar_ppn_type,'N') as ar_ppn_type,
                    ar_type.code_name as ar_type_name,
                    taxclass_mstr.code_name as taxclass_name
                FROM public.ar_mstr
                INNER JOIN public.en_mstr ON (public.ar_mstr.ar_en_id = public.en_mstr.en_id)
                INNER JOIN public.ptnr_mstr ON (public.ar_mstr.ar_bill_to = public.ptnr_mstr.ptnr_id)
                INNER JOIN public.cu_mstr ON (public.ar_mstr.ar_cu_id = public.cu_mstr.cu_id)
                INNER JOIN public.code_mstr credit_term_mstr ON (public.ar_mstr.ar_credit_term = credit_term_mstr.code_id)
                INNER JOIN public.ac_mstr ON (public.ar_mstr.ar_ac_id = public.ac_mstr.ac_id)
                LEFT OUTER JOIN public.ac_mstr ac_mstr_prepaid ON (public.ar_mstr.ar_ac_prepaid = ac_mstr_prepaid.ac_id)
                INNER JOIN public.sb_mstr ON (public.ar_mstr.ar_sb_id = public.sb_mstr.sb_id)
                INNER JOIN public.cc_mstr ON (public.ar_mstr.ar_cc_id = public.cc_mstr.cc_id)
                INNER JOIN public.code_mstr ar_type ON (public.ar_mstr.ar_type = ar_type.code_id)
                INNER JOIN public.bk_mstr ON (public.ar_mstr.ar_bk_id = bk_mstr.bk_id)
                LEFT OUTER JOIN public.code_mstr taxclass_mstr ON (public.ar_mstr.ar_tax_class_id = taxclass_mstr.code_id)
                WHERE
                    ar_add_date > :lastTimestamp
            `, {
                replacements: {
                    lastTimestamp
                },
                logging: (query, sqlCommand) => {

                }
            })

        return data;
    }
}

let CreditDebitMemoScript = new CreditDebitMemo()
CreditDebitMemoScript.run();