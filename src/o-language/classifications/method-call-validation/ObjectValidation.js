const Classification = require('../Classification')
const {FailedAssertionError} = require('../Errors')
const ValidationFailureMessageFormatter = require('./ValidationFailureMessageFormatter')

/*
    Class(`
        An ObjectValidation is a pair of (object, CompiledAsssertion).
        It's purpose is to allow to collect several objects with the assertions
        to validate on them and later validate all them all.
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
        this.instanceVariables = ['objectToValidate', 'compiledAssertion']
    }

    afterInstantiation() {
        // This behaviour could be split to a different object but since the
        // ObjectValidation in the object evaluating the assertions
        // it might format the error messages as well.
        this.behaveAs( ValidationFailureMessageFormatter )
    }

    initialize({ objectToValidate: objectToValidate }) {
        this.objectToValidate = objectToValidate
    }

    /*
        Method(`
            Returns the CompiledAssertion.

            With the returned CompiledAssertion it is possible to evaluate its assertions
            to validate one or more objects.
        `)
    */
    setCompiledAssertion({ compiledAssertion: compiledAssertion }) {
        return this.compiledAssertion = compiledAssertion
    }

    /*
        Method(`
            Validates the assertions compiled in the assertionCompiler on the objectToValidate.
            If any assertion fails it raises a FailedAssertionError.
        `)
    */
    validate({ methodCallInfo: methodCallInfo }) {
        const validationResult =
            this.compiledAssertion.validate({ target: this.objectToValidate })

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
