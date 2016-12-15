const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { DOMAIN } = require('../config'),
    { isEmpty } = require('lodash'),
    { currencies } = require('../maps/creditCurrency'),
    { purpose } = require('../maps/creditPurpose'),
    { types } = require('../maps/creditPaymentType'),
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

const addDetailsToCredit = async(function(credit) {
    const result = objectAssign(credit);

    await (getDom(`${DOMAIN}${credit.link}`)
        .then($ => {
            const rows = $('.conditions-table tr'),
                page = $($(rows).find('a')[1]).attr('href'),
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
                                currencyName = currencies[$(column).text().trim()]
                            }
                            break;
                        case 1: 
                            const sgs = $(column).find('strong');
                            minAmmount = numeral($(sgs[0]).text().trim()).value();
                            maxAmmount = numeral($(sgs[1]).text().trim()).value() || minAmmount;
                            break;
                        default:
                            const term = arr[idx - 2].split('до');
                            resultArr.push({
                                currencyName,
                                minAmmount,
                                maxAmmount,
                                minTermInMonth: numeral(term[0]).value(),
                                maxTermInMonth: numeral(term[1] || term[0]).value(),
                                percentage: $(column).text().trim().split('%')[0].split(': ')[1] ? $(column).text().trim().split('%')[0].split(': ')[1].split(',').join('.') : null
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

            result.needsGurantor = temp['Без поручителей'] == 'Нет';
            //result.gracePeriod = numeral(temp['Срок рассмотрения заявки']).value();
            result.pledge = temp['Без залога'] == 'Нет';
            result.needCertificates = temp['Без справок'] == 'Нет';
            result.goalName = purpose[temp['Цель кредита']];
            result.clientTypeName = temp['Цель кредита'] == 'Для бизнеса' ? 'LEGAL' : 'PHYSICAL';
            result.updateDate = temp['Дата обновления:'] ? temp['Дата обновления:'].split('.').reverse().join('-') : [];
            result.paymentPosibilityName = types[temp['Варианты выдачи']];
            result.repaymentMethodName = 'MOUNTLY_SIMILAR_PART'; 
            result.description = Base64.encode(temp['Краткая информация']);
         }));

    return result;
});

module.exports.addDetailsToCredit = addDetailsToCredit;