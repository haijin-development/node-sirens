const Classification = require('../Classification')
const MethodValidatorProtocol = require('../../protocols/MethodValidatorProtocol')
const ParamValidator = require('./ParamValidator')

class MethodValidator {
    /// Definition

    static definition() {
        this.instanceVariables = ['validators']
        this.assumes = []
        this.implements = [MethodValidatorProtocol]
    }

    /// Initializing

    afterInstantiation() {
        this.validators = []
    }

    addValidator({ validator: validator }) {
        this.validators.push( validator )

        return validator        
    }

    newParamValidator() {
        const validator = ParamValidator.new()

        this.addValidator({ validator: validator })

        return validator        
    }

    /// Validators

    param(paramValue) {
        const paramValidator = this.newParamValidator()

        paramValidator.setValue( paramValue )

        return paramValidator
    }

    /// Evaluating

    evaluateCollectedValidation() {
        this.validators.forEach( (validator) => {
            validator.evaluate()
        })
    }
}

module.exports = Classification.define(MethodValidator)
