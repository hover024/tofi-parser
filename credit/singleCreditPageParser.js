const
    { getDom } = require('../common/dom'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    { DOMAIN } = require('../config'),
    objectAssign = require('object-assign');

const addDetailsToCredit = async(function(credit) {
    const result = objectAssign(credit);

    await (getDom(`${DOMAIN}${credit.link}`)
        .then($ => {
            const rows = $('.conditions-table tr');

            rows.each((idx, row) => {
                const columns = $(row).children('td');

                result[$(columns[0]).text()] = ($(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '') + '   ' + credit.link;
            });
        }));

    return result;
});

module.exports.addDetailsToCredit = addDetailsToCredit;