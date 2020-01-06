const Classification = require('../../Classification')

/*
	Class(`
		A WithEachExpression models a CompiledAssertion that, when evaluated, validates
        that each item of an iterable target object satisfy the assertions.

        When a WithEachExpression is evaluated on a target object it assumes that the
        target is iterable. It iterates the target object and for each item
        it evaluates this WithEachExpression.eachCompiledExpression.
	`)
*/
class WithEachExpression {
	static definition() {
		this.instanceVariables = ['eachCompiledExpression']
	}

	initialize({ eachCompiledExpression: eachCompiledExpression }) {
		this.eachCompiledExpression = eachCompiledExpression
	}

	// Asking

	isWithEachExpression() {
		return true
	}

	// Accessing

    getId() {
        return 'withEach'
    }

	// Validating

    /*
        Method(`
            Validates that each item in the given iterable object satisfies the
            eachCompiledExpression.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
        let index = 0

        for( const eachItem of object ) {
            this.validateEachItem({
                eachItem: eachItem,
                index: index,
                validationResult: validationResult,
                iterable: object,
            })

            index += 1
        }
    }

    validateEachItem({
        eachItem: eachItem, index: index, validationResult: validationResult, iterable: iterable,
    }) {
        const eachValidationResult = this.eachCompiledExpression.validate({
                target: eachItem
            }) 

        const failedValidations = eachValidationResult.getFailedValidations()

        for( const eachValidationFailure of failedValidations ) {
            const failedValidationId = eachValidationFailure.getFailedValidationId()

            const eachId = `target[${index}].${failedValidationId}`

            const validationFailure = eachValidationFailure.copyWith({
                    id: eachId,
                    object: iterable,
                })

            validationResult.addValidationFailure({ validationFailure: validationFailure })
        }
    }
}

module.exports = Classification.define(WithEachExpression)