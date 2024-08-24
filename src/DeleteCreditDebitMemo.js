const moment = require('moment');
const {DebitCreditMemo, Sequelize} = require('../models')
const Connection = require('../config/connection.js');
const {info, error: errorLog} = require('../helper/Logging.js');
const {Op} = require('sequelize')

class DeleteCreditDebitMemo extends Connection {
    execute = async () => {
        await this.process();
    }

    process = async () => {
        try {
            let startDate = moment().startOf('months').format('YYYY-MM-DD')
            let endDate = moment().endOf('months').format('YYYY-MM-DD')

            let accountReceivableNumber = await this.getAccountReceivableNumber(startDate, endDate);
            await this.deleteDebitCreditMemo(accountReceivableNumber, startDate, endDate);

            info({feature: 'DELETE DEBIT CREDIT MEMO',message: 'DATA DELETED SUCCESSFULLY!', total_data: 0});
        } catch (error) {
            errorLog({feature: 'DELETE DEBIT CREDIT MEMO',message: `${error.message}`, total_data: 0});
        }
    }

    getAccountReceivableNumber = async (startDate, endDate) => {
        let data = await this.sourceConnection.query(`
                SELECT
                    DISTINCT (ar_code) AS ar_code
                FROM public.ar_mstr
                WHERE
                    ar_date BETWEEN :start_date AND :end_date
            `, {
                logging: (sql, queryCommand) => {

                },
                replacements: {
                    start_date: startDate,
                    end_date: endDate
                },
                type: Sequelize.QueryTypes.SELECT
            })

        let result = data.map(element => {
            return element.ar_code
        })

        return result
    }

    deleteDebitCreditMemo = async (accountReceivableNumber, startDate, endDate) => {
        await DebitCreditMemo.destroy({
            attributes: [
                'ar_code'
            ],
            where: {
                ar_code: {
                    [Op.notIn]: accountReceivableNumber
                },
                ar_date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        })
    }
}

let ClassDeleteCreditDebitMemo = new DeleteCreditDebitMemo();
ClassDeleteCreditDebitMemo.execute();