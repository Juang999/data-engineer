const moment = require('moment');
const {DebitCreditMemo, Sequelize} = require('../models')
const Connection = require('../config/connection.js');
const {info, error: errorLog} = require('../helper/Logging.js');
const {Op} = require('sequelize')

class UpdateDebitCreditMemo extends Connection {
    execute = async () => {
        await this.process();
    }

    process = async () => {
        let bulkDataDebitCreditMemo = await this.getDataDebitCreditMemo();

        for (const singularDataDebitCreditMemo of bulkDataDebitCreditMemo) {
            await this.updateDebitCreditMemo(singularDataDebitCreditMemo);
        }
    }

    getDataDebitCreditMemo = async () => {
        let [data] = await this.sourceConnection.query(`
                select
                    public.ar_mstr.ar_upd_by,
                    public.ar_mstr.ar_upd_date,
                    public.ar_mstr.ar_code,
                    CAST(public.ar_mstr.ar_amount AS INTEGER) AS ar_amount,
                    CAST(public.ar_mstr.ar_pay_amount AS INTEGER) AS ar_pay_amount,
                    CAST(public.ar_mstr.ar_amount - public.ar_mstr.ar_pay_amount AS INTEGER) as ar_outstanding,
                    CAST(public.ar_mstr.ar_amount * ar_exc_rate AS INTEGER) as ar_amount_idr,
                    CAST(public.ar_mstr.ar_pay_amount * ar_exc_rate AS INTEGER) as ar_pay_amount_idr,
                    CAST((public.ar_mstr.ar_amount - public.ar_mstr.ar_pay_amount) * ar_exc_rate AS INTEGER) as ar_outstanding_idr,
                    public.ar_mstr.ar_status
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
        `, {
            logging: (query, sqlCommand) => {}
        })

        return data;
    }

    updateDebitCreditMemo = async (data) => {
        let resultChecking = await this.checkDataDebitCreditMemo(data.ar_code, data);

        if (resultChecking == false) {
            await DebitCreditMemo.update({
                ar_upd_by: (data.ar_upd_by) ? data.ar_upd_by : null,
                ar_upd_date: (data.ar_upd_date) ? data.ar_upd_date : null,
                ar_amount: data.ar_amount,
                ar_pay_amount: data.ar_pay_amount,
                ar_outstanding: data.ar_outstanding,
                ar_amount_idr: data.ar_amount_idr,
                ar_pay_amount_idr: data.ar_pay_amount_idr,
                ar_outstanding_idr: data.ar_outstanding_idr,
                ar_status: data.ar_status
            }, {
                where: {
                    ar_code: data.ar_code,
                },
                logging: (sql, queryCommand) => {}
            })

            info({feature: 'credit debit memo',message: 'DATA UPDATED!', total_data: 1})
        }
    }

    checkDataDebitCreditMemo = async (ar_code, data) => {
        let {ar_amount, ar_pay_amount, ar_outstanding, ar_amount_idr, ar_pay_amount_idr, ar_outstanding_idr} = await this.findOneData(ar_code);

        if (
            ar_amount == data.ar_amount && 
            ar_pay_amount == data.ar_pay_amount &&
            ar_outstanding == data.ar_outstanding &&
            ar_amount_idr == data.ar_amount_idr &&
            ar_pay_amount_idr == data.ar_pay_amount_idr &&
            ar_outstanding_idr == data.ar_outstanding_idr
        ) {
            return true
        } else {
            return false
        }
    }

    findOneData = async (ar_code) => {
        let {dataValues} = await DebitCreditMemo.findOne({
            attributes: [
                'ar_code',
                [Sequelize.literal('CAST(ar_amount AS INTEGER)'), 'ar_amount'],
                [Sequelize.literal('CAST(ar_pay_amount AS INTEGER)'), 'ar_pay_amount'],
                [Sequelize.literal('CAST(ar_outstanding AS INTEGER)'), 'ar_outstanding'],
                [Sequelize.literal('CAST(ar_amount_idr AS INTEGER)'), 'ar_amount_idr'],
                [Sequelize.literal('CAST(ar_pay_amount_idr AS INTEGER)'), 'ar_pay_amount_idr'],
                [Sequelize.literal('CAST(ar_outstanding_idr AS INTEGER)'), 'ar_outstanding_idr']
            ],
            where: {
                ar_code: ar_code
            },
            logging: (query, sqlCommand) => {}
        })

        return dataValues
    }
}

let ClassUpdateDebitCreditMemo = new UpdateDebitCreditMemo();
ClassUpdateDebitCreditMemo.execute();