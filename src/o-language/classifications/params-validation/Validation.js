const Classification = require('../Classification')
const ValidationProtocol = require('../../protocols/ValidationProtocol')

class Validation {
    /// Definition

    /*
     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['validationClosure']
        this.assumes = []
        this.implements = [ValidationProtocol]
    }

    /*
     Tags([
        'setters', 'public'
     ])
    */
    setValidationClosure(validationClosure) {
        this.validationClosure = validationClosure
    }

    /*
     Tags([
        'evaluating', 'public'
     ])
    */
    getValidationResultOn({ value: value }) {
        return this.validationClosure( value )
    }

    /*
     Tags([
        'evaluating', 'public'
     ])
    */
    evaluateOn({ value: value }) {
        const validationResult = this.getValidationResultOn({ value: value })

        if( ! validationResult.isValid ) {
            this.raiseValidationError({ errorMessage: validationResult.errorMessage() })
        }

    }

    /// Raising errors

    /*
     Tags([
        'raising errors', 'public'
     ])
    */
    raiseValidationError({ errorMessage: errorMessage }) {
        throw new Error( errorMessage )
    }
}

module.exports = Classification.define(Validation)
