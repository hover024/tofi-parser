const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { keyBy } = require('lodash'),
    hash = require('password-hash'),
    { DOMAIN, DEBITS_PATHES, DEBIT_DOMAIN, DEBIT_PAGING } = require('../config'),
    { Base64 } = require('js-base64');

const getDebitsForPath = async(function (path) {
    let result = [];

    [1, 2].forEach(page => await (getDom(`${DOMAIN}${DEBIT_DOMAIN}${path}?${DEBIT_PAGING}=${page}`)
        .then($ => {
            let rows = $('table.items tr.odd');

            rows.each((idx, row) => {
                result = [
                    ...result,
                    getRowData($, row, path)
                ]
            });

            rows = $('table.items tr.even');

            rows.each((idx, row) => {
                result = [
                    ...result,
                    getRowData($, row, path)
                ]
            });
        })));

    return result;
});

const getAllDebits = async( function() {
    let result = [];

    DEBITS_PATHES.forEach(path => {
        result = [
            ...result,
            ...await(getDebitsForPath(path))
        ];
    });

    return keyBy(result, ({bank, name}) => bank+name);
});

function getRowData($, row, path) {
    const
        linkTag = $(row).find('span.checkbox-text a'),
        link = $(linkTag).attr('href'),
        name = $(linkTag).text().trim(),
        bankName = $(row).find('span.n-bank').text().trim(),
        numbers=$(row).children('td.number');
        rate = $(numbers[0]).text().trim(),
        time = $(numbers[1]).text().trim(),
        income = $(numbers[2]).text().trim();

    return {
        link,
        name,
        bankName,
        clientType: path == '/dlia-biznesa' ? {name: 'Юр.лицо', ru_descr: 'Для юридических лиц'} : {name: 'Физ.лицо', ru_descr: 'Для физических лиц'},
        agregatorName: link.split('/').pop()
    }
}

module.exports.getAllDebits = getAllDebits;