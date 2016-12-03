const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { keyBy, keys } = require('lodash'),
    hash = require('password-hash'),
    { DOMAIN, CREDITS_PATHES, CREDIT_DOMAIN, CREDIT_PAGING } = require('../config');

const getCreditsForPath = async(function (path) {
    let result = [];

    [1, 2, 3].forEach(page => await (getDom(`${DOMAIN}${CREDIT_DOMAIN}${path}?${CREDIT_PAGING}=${page}`)
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

const getAllCredits = async( function() {
    let result = [];

    CREDITS_PATHES.forEach(path => {
        result = [
            ...result,
            ...await(getCreditsForPath(path))
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
        rate = $(row).children('td.number').text().trim(),
        payment = $(row).children('td.pay').text().trim(),
        overpay = $(row).children('td.overpay').text().trim();

    return {
        link,
        name,
        rate,
        payment,
        overpay,
        bank
    }
}

module.exports

getAllCredits()
    .then(result => {
        console.log(keys(result).length);
    });