const Classification = require('../Classification')
const AssertionCompiler = require('./AssertionCompiler')

/*
	Class(`
		Helper object to compile and/or validate an object through a lightweight
		implementation of assertions.

		These assertions are meant to validate parameters, pre/post conditions and
		invariants. For that reason its scope is limited. For a fully featured
		validations library another implementation would be a better choice.
	`)
*/
class Validate {
	// Definition
	static definition() {
		this.instanceVariables = []
	}

	/*
		Method(`
			Compiles the given assertionsClosure and evaluates the
			CompiledAssertion on the given object.

			It returns the ValidationResult with the AssertionFailures collected
			during the evaluation.
		`)
	*/
	that({ object: object, satisfies: assertionsClosure }) {
	    const assertionsCompiler = AssertionCompiler.new()

	    const compiledAssertion = assertionsCompiler.compile( assertionsClosure ) 

		const validationResult = compiledAssertion.validate({ target: object })

		return validationResult
	}

	/*
		Method(`
			Compiles the given assertionsClosure and returns the CompiledAssertion.
		`)
	*/
	compile(assertionsClosure) {
	    const assertionsCompiler = AssertionCompiler.new()

	    const compiledAssertion = assertionsCompiler.compile( assertionsClosure ) 

		return compiledAssertion
	}
}

Validate = Classification.define(Validate)

const validateInstance = Validate.new()

module.exports = validateInstance