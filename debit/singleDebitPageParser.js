const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { DOMAIN } = require('../config'),
    { isEmpty } = require('lodash'),
    { currencies } = require('../maps/creditCurrency'),
    { purpose } = require('../maps/creditPurpose'),
    { types } = require('../maps/debitPercentageType'),
    objectAssign = require('object-assign'),
    numeral = require('numeral'),
    { Base64 } = require('js-base64');

function parsePage(page) {
    if(isEmpty(page)){
        return('about:blank');
    }
    if(page[0] == '/'){
        return decodeURIComponent(decodeURIComponent(page.split('/iframe/')[1]));
    }
}

function termToArray(term) {
    let 
        temp = term.split('до');

    temp = temp.map(x => x.includes('дн') ? numeral(x).value()/30 : numeral(x).value());

    return temp;
}

const addDetailsToDebit = async(function(debit) {
    const result = objectAssign(debit);

    await (getDom(`${DOMAIN}${debit.link}`)
        .then($ => {
            const rows = $('.conditions-table tr'),
                page = $($(rows).find('a')[0]).attr('href'),
                arr=[],
                pRows = $('div.credit-rates table tbody tr'),
                resultArr = [],
                headRow = $('div.credit-rates table thead th');
            let 
                currencyName = '',
                minAmmount = '',
                maxAmmount = '',
                temp = {};

            headRow.each((idx, tr) => {
                if (idx > 1) {
                    arr.push($(tr).text().trim())
                }
            });

            pRows.each((idx, row) => {
                const columns = $(row).children('td');
                columns.each((idx, column) => {

                    switch(idx) {
                        case 0:
                            if(!isEmpty($(column).text().trim())){
                                currency = {
                                    name: currencies[$(column).text().trim()],
                                    ru_descr: Base64.encode($(column).text().trim())
                                };
                            }
                            break;
                        case 1: 
                            const sgs = $(column).find('strong');
                            minAmmount = numeral($(sgs[0]).text().trim()).value();
                            maxAmmount = numeral($(sgs[1]).text().trim()).value() || minAmmount;
                            break;
                        default:
                            const term = termToArray(arr[idx - 2]);
                            resultArr.push({
                                currency,
                                minAmmount,
                                maxAmmount,
                                minTermInMonth: term[0],
                                maxTermInMonth: term[1] || term[0],
                                percentage: $(column).text().trim().split('%')[0] ? $(column).text().trim().split('%')[0].split(',').join('.') : null
                            });
                            break;
                    } 
                });
            });

            result.terms = resultArr;

            result.url = parsePage(page);

            rows.each((idx, row) => {
                const columns = $(row).children('td');
                temp[$(columns[0]).text()] = ($(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
                //result[$(columns[0]).text()] = ($(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
            });

            result.updateDate = temp['Дата обновления'] ? temp['Дата обновления'].split('.').reverse().join('-') : null;
            result.percentageType = {
                name: types[temp['Периодичность выплаты процентов']],
                ru_descr: Base64.encode(temp['Периодичность выплаты процентов'])
            };
            result.refilling = temp['Пополнение'] == 'Да';
            result.capitalization = temp['Капитализация'] == 'Да';
            result.beforeTermWithdrawal = temp['Частичное снятие'] == 'Да';
            result.description = Base64.encode(temp['Описание'] ? temp['Описание'].split('Свернуть')[0].trim() : '');
        }));

    return result;
});

module.exports.addDetailsToDebit = addDetailsToDebit;