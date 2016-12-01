const
	cheerio = require('cheerio'),
	request = require('request'),

	DOMAIN = 'http://myfin.by';

function getDom(url) {
	return new Promise((resolve, reject) => {
		request(url, (error, response, html) => {
			result = cheerio.load(html);

			resolve(result);
		});
	});
}

function parseDetails(link) {
	getDom(`${DOMAIN}${link}`)
		.then(dom => {
			const
				res = {},
				rows = dom('.conditions-table tr');

			rows.each((idx, row) => {
				const columns = dom(row).children('td');

				res[dom(columns[0]).text()] = (dom(columns[1]).text()).trim().replace(/(\r\n|\n|\r|\t)/g, '');
			});

			console.log(res);
		});
}

getDom(`${DOMAIN}/kredity/potrebitelskie`)
	.then($ => {
		links = $('table.items .checkbox-text a').toArray().map(link => link.attribs.href);

		parseDetails(links[0]);
	});