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

const addDetailsToCredit = async(function(credit) {
    const result = objectAssign(credit);

    await (getDom(`${DOMAIN}${credit.link}`)
        .then($ => {
            const rows = $('.conditions-table tr'),
                page = $($(rows).find('a')[1]).attr('href');

            result.page = parsePage(page);

            rows.each((idx, row) => {
                const columns = $(row).children('td');

                result[$(columns[0]).text()] = ($(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
            });
        }));

    return result;
});

module.exports.addDetailsToCredit = addDetailsToCredit;