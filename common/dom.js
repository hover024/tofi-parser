const
    cheerio = require('cheerio'),
    request = require('request');

function getDom(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
            result = cheerio.load(html);

            resolve(result);
        });
    });
}

module.exports.getDom = getDom;