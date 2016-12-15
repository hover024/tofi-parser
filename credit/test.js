const 
	{ getAllCredits } = require('./creditsPageParser'),
	{ addDetailsToCredit } = require('./singleCreditPageParser'),
	{ values } = require('lodash'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    payType = new Set(),
    givingType = new Set(),
    fine = new Set(),
    max = new Set(),
    time = new Set(),
    { maxSumm } = require('../maps/creditMaxSumm'),
    objectAssign = require('object-assign'),
    numeral = require('numeral'),
    fs = require('fs');

let 
	fields = {},
	result = [];

const getSetOfFields = async(function() {
	const credits = await(getAllCredits()),
		crs = values(credits),
		file = fs.createWriteStream('credits.json');;

	for(let i = 0; i < crs.length; i++) {
		const details = await(addDetailsToCredit(crs[i]));

		fields = objectAssign(fields, details);

		if(details.updateDate)
			result.push(details);

		details.terms.forEach(item => {
			//payType.add(item['minTermInMonth']);
			//givingType.add(item['maxTermInMonth']);
		});
	    fine.add(details['Варианты выдачи']);
	    max.add(maxSumm[details['Максимально возможная сумма по кредиту']]);
	    time.add(details['Срок рассмотрения заявки']);
	}

	file.write(JSON.stringify(result));
	file.end();
});

const maxs = [];

getSetOfFields()
	.then(() => {
		//console.log(fields);
		//console.log('------------payType-------------');
		//console.log(payType);
		//console.log('------------givingType-------------');
		//console.log(givingType);
		//console.log('------------fine-------------');
		//console.log(fine);
		//console.log('------------max-------------');
		//console.log(max);
		//console.log('------------time-------------');
		//console.log(time);*/
	});

