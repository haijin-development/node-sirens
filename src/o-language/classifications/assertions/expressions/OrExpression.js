const Classification = require('../../Classification')
const ValidationResult = require('../ValidationResult')

/*
	Class(`
		An OrExpression models a logical

                p or q

        When an OrExpression is evaluated on a target object it first evaluates
        its left expression.

        If the left expression passes it does not evaluate its right expression.

        If the left expression fails it does not add a ValidationFailure but it
        evaluates its right expression.

        If the right expression also fails it creates a new ValidationFailure
        for the entire OrExpression and adds it to the ValidationResult.
	`)
*/
class OrExpression {
	static definition() {
		this.instanceVariables = ['id', 'leftExpression', 'rightExpression']
	}

	initialize({ leftExpression: leftExpression, rightExpression: rightExpression }) {
        const leftId = leftExpression ? leftExpression.getId() : null
        const rightId = rightExpression ? rightExpression.getId() : null

        this.id = { or: { left: leftId, right: rightId } }
		this.leftExpression = leftExpression
		this.rightExpression = rightExpression
	}

	// Asking

	isOrExpression() {
		return true
	}

	// Accessing

    getId() {
        return this.id
    }

	/*
		Method(`
			Sets the rightExpression to the given expression.
		`)
	*/
	setRightExpression(expression) {
		this.rightExpression = expression

        this.id.or.right = expression.getId()
	}

	// Validating

    /*
        Method(`
            Validates that the given object satisfies this OrThenExpression.

			The OrThenExpression is satisfied if both its left and right expressions
			are satisfied.

			First it evaluates the leftExpression. If it passes then it evaluates the
			rightExpression.

			If the left expression fails an assertion it does not evaluate the
			right expression.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
        const leftValidationResult = ValidationResult.new()

    	this.leftExpression.validate({
    		target: object,
    		validationResult: leftValidationResult,
    	})

        if( ! leftValidationResult.hasFailedValidations() ) { return }

        const rightValidationResult = ValidationResult.new()

        this.rightExpression.validate({
            target: object,
            validationResult: rightValidationResult,
        })

        if( ! rightValidationResult.hasFailedValidations() ) { return }

        validationResult.addFailedValidationFrom({
            validationId: 'or',
            validatedValue: object,
            validationData: {},
        })
    }
}

module.exports = Classification.define(OrExpression)