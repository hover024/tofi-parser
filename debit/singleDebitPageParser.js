const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { DOMAIN } = require('../config'),
    { isEmpty } = require('lodash'),
    objectAssign = require('object-assign');

function parsePage(page) {
    if(isEmpty(page)){
        return('about:blank');
    }
    if(page[0] == '/'){
        return decodeURIComponent(decodeURIComponent(page.split('/iframe/')[1]));
    }
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
                currency = '',
                from = '',
                to = '';

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
                                currency = $(column).text().trim()
                            }
                            break;
                        case 1: 
                            const sgs = $(column).find('strong');
                            from = $(sgs[0]).text().trim();
                            to = $(sgs[1]).text().trim();
                            break;
                        default:
                            resultArr.push({
                                currency,
                                from,
                                to,
                                period: arr[idx - 2],
                                value: $(column).text().trim()
                            });
                            break;
                    } 
                });
            });

            result.terms = resultArr;

            result.page = parsePage(page);

            rows.each((idx, row) => {
                const columns = $(row).children('td');

                result[$(columns[0]).text()] = ($(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
            });
        }));

    return result;
});

module.exports.addDetailsToDebit = addDetailsToDebit;