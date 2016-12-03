const 
	{ getAllCredits } = require('./creditsPageParser'),
	{ addDetailsToCredit } = require('./singleCreditPageParser'),
	{ values } = require('lodash'),
    async = require('asyncawait/async'),
    await = require('asyncawait/await'),
    objectAssign = require('object-assign');

let 
	fields = {};

const getSetOfFields = async(function() {
	const credits = await(getAllCredits()),
		crs = values(credits);

	for(let i = 0; i < crs.length; i++) {
		const details = await(addDetailsToCredit(crs[i]));
		fields = objectAssign(fields, details);
	}
});

getSetOfFields()
	.then(() => console.log(fields));