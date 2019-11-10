const Classification = require('../Classification')
const MethodValidatorProtocol = require('../../protocols/MethodValidatorProtocol')
const ParamValidator = require('./ParamValidator')

class MethodValidator {
    /// Definition

    /*
     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['validators']
        this.assumes = []
        this.implements = [MethodValidatorProtocol]
    }

    /// Initializing

    /*
     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.validators = []
    }

    /*
     Tags([
        'implementation', 'adding'
     ])
    */
    addValidator({ validator: validator }) {
        this.validators.push( validator )

        return validator        
    }

    /*
     Tags([
        'implementation', 'creating objects'
     ])
    */
    newParamValidator() {
        const validator = ParamValidator.new()

        this.addValidator({ validator: validator })

        return validator        
    }

    /// Validators

    /*
     Tags([
        'dsl', 'public'
     ])
    */
    param(paramValue) {
        const paramValidator = this.newParamValidator()

        paramValidator.setValue( paramValue )

        return paramValidator
    }

    /// Evaluating

    /*
     Tags([
        'public', 'evaluating'
     ])
    */
    evaluateCollectedValidation() {
        this.validators.forEach( (validator) => {
            validator.evaluate()
        })
    }
}

module.exports = Classification.define(MethodValidator)
