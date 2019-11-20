const Classification = require('../Classification')
const ValidationProtocol = require('../../protocols/ValidationProtocol')

class OrValidation {
    /// Definition

    /*
     Tags([
        'definition', 'implementation'
     ])
    */
    static definition() {
        this.instanceVariables = ['leftValidation', 'rightValidation', 'methodInfo']
        this.assumes = []
        this.implements = [ValidationProtocol]
    }

    /// Accessing

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
    setLeftValidation(validation) {
        this.leftValidation = validation
    }

    /*
     Tags([
        'setters', 'public'
     ])
    */
    setRightValidation(validation) {
        this.rightValidation = validation
    }

    /// Evaluating

    /*
     Tags([
        'evaluating', 'public'
     ])
    */
    getValidationResultOn({ value: value }) {
        const leftValidationResult = this.leftValidation.getValidationResultOn({ value: value })

        if( leftValidationResult.isValid === true ) {
            return {
                isValid: true
            }
        }

        const rightValidationResult = this.rightValidation.getValidationResultOn({ value: value })

        if( rightValidationResult.isValid === true ) {
            return {
                isValid: true
            }
        }

        const methodInfo = this.methodInfo

        return {
            isValid: false,
            errorMessage: () => { return `Method ${methodInfo.protocolName}.${methodInfo.methodName} validation failed for all the branches in the .or() expression.` }
        }
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
        'raising errors', 'implementation'
     ])
    */
    raiseValidationError({ errorMessage: errorMessage }) {
        throw new Error( errorMessage )
    }

}

module.exports = Classification.define(OrValidation)
