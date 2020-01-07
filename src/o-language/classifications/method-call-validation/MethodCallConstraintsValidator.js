const Classification = require('../Classification')
const MethodCallConstraintsValidatorProtocol = require('../../protocols/MethodCallConstraintsValidatorProtocol')
const ObjectValidation = require('./ObjectValidation')
const AssertionCompiler = require('../assertions/AssertionCompiler')

/*
    Class(`
       This classification collects and evaluates the constraints that a receiver object and the
       parameters of a method called are expected to have before and after the activation of the
       method call.
    `)

    Tags([
       'definition', 'implementation'
    ])
*/
class MethodCallConstraintsValidator {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = [
            'paramsValidations',
            'temporaryAssertionCompiler',
        ]
        this.assumes = []
        this.implements = [MethodCallConstraintsValidatorProtocol]
    }

    /// Initializing

    /*
     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.paramsValidations = []
    }

    /*
        Method(`
            Adds the given objectValidation to the collection of validations to evaluate on
            this method call.
            The given objectValidation holds the object to validate and the CompiledAssertions
            to evaluate on that object.
        `)

        Tags([
            'implementation', 'adding'
        ])
    */
    addParamValidation(objectValidation) {
        this.paramsValidations.push( objectValidation )
    }

    /// Validations

    /*
        Method(`
            This method is called in the following context:

                append({ string: string, if: condition }) {
                    this.param(string) .isString()
                }

            The method first creates an ObjectValidation on the given paramValue,
            the parameter string in the example and stores it in this MethodCallConstraintsValidator.

            Then it creates a new temporary AssertionCompiler, keeps it and returns it.

            This AssertionCompiler will compile the assertions following the param(...)
            declaration. In the example will compile the expression
                    .isString()

            The caller of this method then *must* call the method

                    this.endCurrentAssertionCompilation()

            to attach the last CompiledAssertion to the last ObjectValidation.

            The call to

                    .endCurrentAssertionCompilation()

            is necessary because this method does not have the context to know which
            one is the last assertion to compile unless the DSL required to define a
            scope or to include an explicit ending expression but that adds noise
            to the DSL expressiveness.

            Compare the following expressions:

                append({ string: string, if: condition }) {
                    this.assertThat({
                        param: string,
                        fullfills: (param) => { param .isString() }
                    })

                    // against

                    this.param(string) .isString()
                }

            The use of this Classification is ackward and error prone but it makes the
            method validation DSL more simple to use and it is an implementation
            mechanism, not a public interface.
        `)

        Tags([
            'public', 'dsl'
        ])
    */
    param(paramValue) {
        this.endCurrentAssertionCompilation()

        const paramValidation = ObjectValidation.new({
            objectToValidate: paramValue,
        })

        this.addParamValidation(paramValidation)

        this.temporaryAssertionCompiler = AssertionCompiler.new()

        return this.temporaryAssertionCompiler
    }

    endCurrentAssertionCompilation() {
        if( this.temporaryAssertionCompiler === undefined ) { return }

        const compiledAssertion =
            this.temporaryAssertionCompiler.getCompiledAssertion()

        const currentParamValidation = this.getCurrentParamValidation()

        currentParamValidation.setCompiledAssertion({
            compiledAssertion: compiledAssertion
        })

        this.temporaryAssertionCompiler = null
    }

    getCurrentParamValidation() {
        return this.paramsValidations[ this.paramsValidations.length - 1 ]
    }

    /// Evaluating

    /*
        Method(`
            Evaluates the collected params validations on the parameters of a method call.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    evaluateParametersValidationsOn({ methodCallInfo: methodCallInfo }) {
        this.paramsValidations.forEach( (eachValidation) => {
            eachValidation.validate({
                methodCallInfo: methodCallInfo
            })
        })
    }
}

module.exports = Classification.define(MethodCallConstraintsValidator)
