const Classification = require('../Classification')
const ValidationFailure = require('./ValidationFailure')

/*
	Class(`
		A ValidationResult is the result of evaluating a compiled assertion on a
		target object.

		It holds the information about the failed assertions.

		The evaluation of a compiled Assertion expression on a target object in no case
		throws an error, it always returns a ValidationResult with the failed assertion(s).

		If the application requires to throw a validation error it can query this
		ValidationResult and throw the error.
	`)
*/
class ValidationResult {
	// Definition

	static definition() {
		this.instanceVariables = ['failedValidations']
	}

	// Initializing

	initialize() {
		this.failedValidations = []
	}

	// Accessing

	/*
		Method(`
			Returns the ValidationFailure collected.
		`)
	*/
	getFailedValidations() {
		return this.failedValidations
	}

	// Querying

	/*
		Method(`
			Returns the number of the ValidationFailure collected.
		`)
	*/
	getFailedValidationsCount() {
		return this.failedValidations.length
	}

	// Asking

	/*
		Method(`
			Returns true if this object collected at least one ValidationFailure.
		`)
	*/
	hasFailedValidations() {
		return this.getFailedValidationsCount() > 0
	}

	// Adding FailedValidations

	/*
		Method(`
			Adds the given validationFailure to the ordered collection of
			ValidationFailures collected.
		`)
	*/
	addValidationFailure({ validationFailure: validationFailure }) {
		this.failedValidations.push( validationFailure )
	}

	/*
		Method(`
			Builds a new ValidationFailure object and adds it to the ordered collection of
			ValidationFailures collected.
		`)
	*/
	addFailedValidationFrom({
		validationId: validationId, validatedValue: validatedValue, validationData: validationData
	 }) {
		const validationFailure = ValidationFailure.new({
			failedValidationId: validationId,
			validatedValue: validatedValue,
			validationData: validationData,
		})

		this.addValidationFailure({ validationFailure: validationFailure })
	}
}

module.exports = Classification.define(ValidationResult)