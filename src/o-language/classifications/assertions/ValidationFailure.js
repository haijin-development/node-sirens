const Classification = require('../Classification')

/*
    Class(`
        A ValidationFailure is created when a compiled assertion is evaluated on a
        target object and the assertion fails.

        It holds the minimum information about the assertion failure: the Assertion
        id (including the full path from the top of the Assertion expression in the 
        case of nested Assertion expressions) and the validated object.
    `)
*/
class ValidationFailure {
    static definition() {
        this.instanceVariables = ['failedValidationId', 'validatedValue', 'validationData']
    }

    initialize({
        failedValidationId: failedValidationId, validatedValue: validatedValue, validationData: validationData
    }) {
        this.failedValidationId = failedValidationId
        this.validatedValue = validatedValue
        this.validationData = validationData
    }

    getFailedValidationId() {
        return this.failedValidationId
    }

    getValidatedValue() {
        return this.validatedValue
    }

    getValidationData() {
        return this.validationData
    }

    copyWith({ id: id, object: object, }) {
        return this.thisClassification().new({
            failedValidationId: id,
            validatedValue: object,
            validationData: this.validationData,
        })
    }
}

module.exports = Classification.define(ValidationFailure)