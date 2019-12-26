const Protocol = require('../classifications/Protocol')

class MethodCallConstraintsValidatorProtocol {

	/*
		Method(`
			Declares one or more constraints that the given parameter is expected to meet right before
			the method call activation.
		`)

 		Tags([
    		'public', 'dsl'
 		])
	*/
	param(parameter) {}

    /*
    	Method(`
    		Evaluates the collected params validations on the parameters of a method call.
    	`)

		Tags([
    		'public', 'evaluating'
 		])
	*/
	evaluateParametersValidations() {}
}

module.exports = Protocol.define(MethodCallConstraintsValidatorProtocol)
