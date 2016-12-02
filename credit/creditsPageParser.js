const
    { getDom } = require('../common/dom'),
    await = require('await'),
    { DOMAIN, CREDITS_PATHES, CREDIT_DOMAIN } = require('../config');

function getCreditsForPath(path) {
    let result = [];

    await(getDom(`${DOMAIN}${CREDIT_DOMAIN}${path}`)
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

            console.log(result);
        }));

    console.log(result);
}

function getRowData($, row) {
    const
        linkTag = $(row).find('span.checkbox-text a'),
        link = $(linkTag).attr('href'),
        name = $(linkTag).text(),
        bank = $(row).find('span.n-bank').text(),
        rate = $(row).children('td.number').text(),
        payment = $(row).children('td.pay').text(),
        overpay = $(row).children('td.overpay').text();

    return {
        link,
        name,
        rate,
        payment,
        overpay,
        bank
    }
}

getCreditsForPath('/potrebitelskie');

getDom(`${DOMAIN}/kredity/potrebitelskie`)
    .then($ => {
        let result = [];
        rows = $('table.items tr.odd');

        rows.each((idx, row) => {
            const
                linkTag = $(row).find('span.checkbox-text a'),
                link = $(linkTag).attr('href'),
                name = $(linkTag).text(),
                bank = $(row).find('span.n-bank').text(),
                rate = $(row).children('td.number').text(),
                payment = $(row).children('td.pay').text(),
                overpay = $(row).children('td.overpay').text();

            result = [
                ...result,
                {
                    link,
                    name,
                    rate,
                    payment,
                    overpay,
                    bank
                }
            ]
        });

        //console.log(result);
    });