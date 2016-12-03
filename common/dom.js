const
    cheerio = require('cheerio'),
    request = require('request');

function getDom(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, html) => {
        	try {
            	result = cheerio.load(html);
            	resolve(result);
        	} catch (e){
        		console.log('-------------------');
        		console.log(url);
        		console.log('-------------------');
        		result = cheerio.load('<div/>');
            	resolve(result);
        	}
        });
    });
}

module.exports.getDom = getDom;