const Protocol = require('../classifications/Protocol')

class ValidationProtocol {
    /*
		Tags([
    		'public', 'evaluating'
 		])
	*/
	getValidationResultOn({ value: value }) {}

    /*
 		Tags([
    		'public', 'evaluating'
 		])
	*/
	evaluateOn({ value: value }) {}
}

module.exports = Protocol.define(ValidationProtocol)
