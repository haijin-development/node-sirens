const Classification = require('../Classification')
const ValidationProtocol = require('../../protocols/ValidationProtocol')

class OrValidation {
    /// Definition

    static definition() {
        this.instanceVariables = ['leftValidation', 'rightValidation']
        this.assumes = []
        this.implements = [ValidationProtocol]
    }

    /// Accessing

    setLeftValidation(validation) {
        this.leftValidation = validation
    }

    setRightValidation(validation) {
        this.rightValidation = validation
    }

    /// Evaluating

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

        return {
            isValid: false,
            errorMessage: () => { return `The validation failed for all the branches in the .or() expression.` }
        }
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

module.exports = Classification.define(OrValidation)
