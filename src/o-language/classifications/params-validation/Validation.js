const Classification = require('../Classification')
const ValidationProtocol = require('../../protocols/ValidationProtocol')

class Validation {
    /// Definition

    static definition() {
        this.instanceVariables = ['validationClosure']
        this.assumes = []
        this.implements = [ValidationProtocol]
    }

    setValidationClosure(validationClosure) {
        this.validationClosure = validationClosure
    }

    getValidationResultOn({ value: value }) {
        return this.validationClosure( value )
    }

    evaluateOn({ value: value }) {
        const validationResult = this.getValidationResultOn({ value: value })

        if( ! validationResult.isValid ) {
            this.raiseValidationError({ errorMessage: validationResult.errorMessage() })
        }

    }

    /// Raising errors

    raiseValidationError({ errorMessage: errorMessage }) {
        throw new Error( errorMessage )
    }
}

module.exports = Classification.define(Validation)
