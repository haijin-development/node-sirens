const Classification = require('../Classification')
const MethodCallConstraintsValidatorProtocol = require('../../protocols/MethodCallConstraintsValidatorProtocol')
const ObjectValidation = require('./ObjectValidation')

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
            'methodInfo',
            'paramsValidations',
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
        this.methodInfo = {}
    }

    setMethodInfo(methodInfo) {
        this.methodInfo = methodInfo
    }

    getMethodInfo() {
        return this.methodInfo
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
            Declares one or more constraints that the given parameter is expected to meet right before
            the method call activation.
        `)

        Tags([
            'public', 'dsl'
        ])
    */
    param(paramValue) {
        const paramValidation = ObjectValidation.new({
            objectToValidate: paramValue,
            methodInfo: this.methodInfo,
        })

        this.addParamValidation(paramValidation)

        return paramValidation.getAssertionCompiler()
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
    evaluateParametersValidations() {
        this.paramsValidations.forEach( (eachValidation) => {
            eachValidation.validate()
        })
    }
}

module.exports = Classification.define(MethodCallConstraintsValidator)
