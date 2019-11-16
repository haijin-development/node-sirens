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
        this.instanceVariables = ['validationClosure', 'methodInfo']
        this.assumes = []
        this.implements = [ValidationProtocol]
    }

    setMethodInfo(methodInfo) {
        this.methodInfo = methodInfo
    }

    getMethodInfo() {
        return this.methodInfo
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
        return this.validationClosure({ value: value, methodInfo: this.methodInfo })
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
