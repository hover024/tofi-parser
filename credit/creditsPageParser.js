const
    { getDom } = require('../common/dom'),
    { DOMAIN, CREDITS_PATHES, CREDIT_DOMAIN } = require('../config');

function getCredits() {
}

getDom(`${DOMAIN}/kredity/potrebitelskie`)
    .then($ => {
        //links = $('table.items .checkbox-text a').toArray().map(link => link.attribs.href);
        result = {};
        rows = $('table.items tr.odd');

        rows.each((idx, row) => {
            const link = $(row).find('span.checkbox-text a');

            console.log($(link).attr('href'));
            console.log($(link).text());
            // process.exit(1);
        });
    });