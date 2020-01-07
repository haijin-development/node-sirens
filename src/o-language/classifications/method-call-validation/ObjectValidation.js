const Classification = require('../Classification')
const {FailedAssertionError} = require('../Errors')
const ValidationFailureMessageFormatter = require('./ValidationFailureMessageFormatter')

/*
    Class(`
        An ObjectValidation is a validation of an object during a message call.
        The validated object is a parameter of the method call.

        This object wraps the CompiledAssertion that does the actual validation,
        formats the error message and throws a FailedAssertionError when a validation
        fails.
    `)
*/
class ObjectValidation {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = ['compiledAssertion']
    }

    afterInstantiation() {
        // This behaviour could be split to a different object but since the
        // ObjectValidation in the object evaluating the assertions
        // it might format the error messages as well.
        this.behaveAs( ValidationFailureMessageFormatter )
    }

    initialize({ compiledAssertion: compiledAssertion }) {
        return this.compiledAssertion = compiledAssertion
    }

    /*
        Method(`
            Validates the assertions compiled in the assertionCompiler on the
            given objectToValidate.

            If any assertion fails it raises a FailedAssertionError.
        `)
    */
    validate({ methodCallInfo: methodCallInfo, objectToValidate: objectToValidate }) {
        const validationResult =
            this.compiledAssertion.validate({ target: objectToValidate })

        if( validationResult.hasFailedValidations() ) {
            const firstValidationFailure = validationResult.getFailedValidations()[0]

            const failedAssertionMessage = this.formatFailureMessageFor({
                methodCallInfo: methodCallInfo,
                validationFailure: firstValidationFailure,
            })


            throw new FailedAssertionError(failedAssertionMessage)
        }
    }
}

module.exports = Classification.define(ObjectValidation)
