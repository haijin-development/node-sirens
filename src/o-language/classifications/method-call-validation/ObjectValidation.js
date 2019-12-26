const Classification = require('../Classification')
const AssertionCompiler = require('../assertions/AssertionCompiler')
const {FailedAssertionError} = require('../assertions/AssertionErrors')
const ValidationFailureMessageFormatter = require('./ValidationFailureMessageFormatter')

/*
    Class(`
        An ObjectValidation is a pair of (object, CompiledAsssertion).
        It's purpose is to allow to collect several objects with the assertions
        to validate on them and later validate all the collected objects.
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
        this.instanceVariables = ['objectToValidate', 'methodInfo', 'assertionCompiler']
    }

    afterInstantiation() {
        this.assertionCompiler = AssertionCompiler.new()

        // This behaviour could be split to a different object but since the
        // ObjectValidation in the object evaluating the assertions
        // it might format the error messages as well.
        this.behaveAs( ValidationFailureMessageFormatter )
    }

    initialize({ objectToValidate: objectToValidate, methodInfo: methodInfo }) {
        this.objectToValidate = objectToValidate
        this.methodInfo = methodInfo
    }

    /*
        Method(`
            Returns an AssertionCompiler to compile assertions on the object to validate.
            The AssertionCompiler is initially empty but it can be used to progressively
            compile new assertions on the validated object.
        `)
    */
    getAssertionCompiler() {
        return this.assertionCompiler
    }

    /*
        Method(`
            Returns the CompiledAssertion.

            With the returned CompiledAssertion it is possible to evaluate its assertions
            to validate one or more objects.
        `)
    */
    getCompiledAssertion() {
        return this.assertionCompiler.getCompiledAssertion()
    }

    /*
        Method(`
            Validates the assertions compiled in the assertionCompiler on the objectToValidate.
            If any assertion fails it raises a FailedAssertionError.
        `)
    */
    validate() {
        const compiledAssertion = this.getCompiledAssertion()

        const validationResult =
            compiledAssertion.validate({ target: this.objectToValidate })

        if( validationResult.hasFailedValidations() ) {
            const firstValidationFailure = validationResult.getFailedValidations()[0]

            const failedAssertionMessage = this.formatFailureMessageFor({
                methodInfo: this.methodInfo,
                validationFailure: firstValidationFailure,
            })


            throw new FailedAssertionError(failedAssertionMessage)
        }
    }

    /*
        Method(`
            Returns a formatted error message for the given failedValidation.
        `)
    */
    _formatFailureMessageFor({ failedValidation: failedValidation }) {
        const assertionId = failedValidation.getFailedValidationId()

        const validatedValue = failedValidation.getValidatedValue()

        const methodInfoString =
            `${this.methodInfo.protocolName}.${this.methodInfo.methodName}`

        switch( assertionId ) {
            case 'isNull': {
                return `Method ${methodInfoString} expected a null value, got a ${validatedValue}.`
                break
            }
            case 'isNotNull': {
                return `Method ${methodInfoString} expected a non null value, got null.`
                break
            }
            default: {
                throw new Error(`Unkown validation id '${assertionId}'`)
            }
        }
    }
}

module.exports = Classification.define(ObjectValidation)
