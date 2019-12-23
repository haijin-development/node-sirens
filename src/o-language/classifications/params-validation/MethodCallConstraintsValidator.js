const Classification = require('../Classification')
const MethodCallConstraintsValidatorProtocol = require('../../protocols/MethodCallConstraintsValidatorProtocol')
const ParamValidator = require('./ParamValidator')
const ObjectValidator = require('./ObjectValidator')

/*
    Class(`
        This classification collects and evaluates the constraints that an receiver object and the
        parameters of a method called are expected to have before and after the activation of the
        method call.
    `)

    Implementation(`
        This implementation has several problems and should be replaced with one implementation
        that would allow to compile a set of abstract constraints without verifying them on a concrete
        object and in a different and independent method to verify those pre-compiled constraints on
        any given method call invocation. 
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
            'paramsValidators', 'preConditionsClosure', 'postConditionsClosure',
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
        this.paramsValidators = []
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
            Adds a validator to the collection of validations on the parameters of a
            method call.
        `)

        Tags([
            'implementation', 'adding'
        ])
    */
    addParamValidator({ validator: validator }) {
        this.paramsValidators.push( validator )

        return validator        
    }

    /*
        Method(`
            Returns an object that evaluates the declared validations on a parameter.

        Tags([
            'implementation', 'validating'
        ])
    */
    newParamValidator() {
        const validator = ParamValidator.new()

        validator.setMethodInfo( this.methodInfo )

        return validator        
    }

    /*
        Method(`
            Returns an object that evaluates the declared validations on the receiver
            before or after activating a method call.

        Tags([
            'implementation', 'validating'
        ])
    */
    newObjectValidator() {
        const validator = ObjectValidator.new()

        validator.setMethodInfo( this.methodInfo )

        return validator        
    }

    /// Validators

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
        const paramValidator = this.newParamValidator()

        paramValidator.setValue( paramValue )

        this.addParamValidator({ validator: paramValidator })

        return paramValidator
    }

    /*
        Method(`
            Declares one or more constraints that the receiver object is expected to meet right before
            the method call activation.
        `)

        Tags([
            'public', 'dsl'
        ])
    */
    preConditions(receiverConstraintsClosure) {
        this.preConditionsClosure = receiverConstraintsClosure
    }

    /*
        Method(`
            Declares one or more constraints on the receiver before executing the method call.
        `)

        Tags([
            'public', 'dsl'
        ])
    */
    postConditions(receiverConstraintsClosure) {
        this.postConditionsClosure = receiverConstraintsClosure
    }

    /// Evaluating

    /*
        Method(`
            Evaluates the validations of the object pre-conditions before the method call activation.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    validatePreConditions({ onObject: object }) {
        if( this.preConditionsClosure === undefined ) { return }

        const objectValidator = this.newObjectValidator()

        objectValidator.setObject( object )

        this.preConditionsClosure.call( objectValidator )

        objectValidator.evaluate()
    }

    /*
        Method(`
            Evaluates the validations of the object post-conditions before the method call activation.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    validatePostConditions({ onObject: object }) {
        if( this.postConditionsClosure === undefined ) { return }

        const objectValidator = this.newObjectValidator()

        objectValidator.setObject( object )

        this.postConditionsClosure.call( objectValidator )
    }

    /*
        Method(`
            Evaluates the collected params validations on the parameters of a method call.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    evaluateParametersValidations() {
        this.paramsValidators.forEach( (validator) => {
            validator.evaluate()
        })
    }
}

module.exports = Classification.define(MethodCallConstraintsValidator)
