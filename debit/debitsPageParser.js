const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { keyBy } = require('lodash'),
    hash = require('password-hash'),
    { DOMAIN, DEBITS_PATHES, DEBIT_DOMAIN, DEBIT_PAGING } = require('../config');

const getDebitsForPath = async(function (path) {
    let result = [];

    [1, 2].forEach(page => await (getDom(`${DOMAIN}${DEBIT_DOMAIN}${path}?${DEBIT_PAGING}=${page}`)
        .then($ => {
            let rows = $('table.items tr.odd');

            rows.each((idx, row) => {
                result = [
                    ...result,
                    getRowData($, row)
                ]
            });

            rows = $('table.items tr.even');

            rows.each((idx, row) => {
                result = [
                    ...result,
                    getRowData($, row)
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

function getRowData($, row) {
    const
        linkTag = $(row).find('span.checkbox-text a'),
        link = $(linkTag).attr('href'),
        name = $(linkTag).text().trim(),
        bank = $(row).find('span.n-bank').text().trim(),
        numbers=$(row).children('td.number');
        rate = $(numbers[0]).text().trim(),
        time = $(numbers[1]).text().trim(),
        income = $(numbers[2]).text().trim();

    return {
        link,
        name,
        rate,
        time,
        income,
        bank
    }
}

module.exports.getAllDebits = getAllDebits;