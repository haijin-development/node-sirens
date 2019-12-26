const Classification = require('../../Classification')

/*
	Class(`
		An AndThenExpression models a logical 'and then', commonly expressed in js with
        the '&&' operator

		When a AndThenExpression is evaluated on a target object it first evaluates
		its left expression. If the assertions passes then it evaluates its right
		expression.

		If the assertion on the left expression fails a ValidationFailure is added
		to the ValidationResult and the right expression is not evaluated.

		If you want to always evaluate both left and right expressions use .and()
		instead.

        The AndThenExpression only adds the ValidationFailures of its right expression
        if its left expression passes.

        This behaviour can be used to validate assertions only up to the first assertion
        failure

            .isNotUndefined() .andThen() .isArray() .andThen() .isNotEmpty()
	`)
*/
class AndThenExpression {
	static definition() {
		this.instanceVariables = ['id', 'leftExpression', 'rightExpression']
	}

	initialize({ leftExpression: leftExpression, rightExpression: rightExpression }) {
        const leftId = leftExpression ? leftExpression.getId() : null
        const rightId = rightExpression ? rightExpression.getId() : null

        this.id = { andThen: { left: leftId, right: rightId } }
		this.leftExpression = leftExpression
		this.rightExpression = rightExpression
	}

	// Asking

	isAndThenExpression() {
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

        this.id.andThen.right = expression.getId()
	}

	// Validating

    /*
        Method(`
            Validates that the given object satisfies this AndThenExpression.

			The AndThenExpression is satisfied if both its left and right expressions
			are satisfied.

			First it evaluates the leftExpression. If it passes then it evaluates the
			rightExpression.

			If the left expression fails an assertion it does not evaluate the
			right expression.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
    	const validationFailuresCount = validationResult.getFailedValidationsCount()

    	this.leftExpression.validate({
    		target: object,
    		validationResult: validationResult,
    	})

    	const newValidationFailuresCount = validationResult.getFailedValidationsCount()

    	if( newValidationFailuresCount > validationFailuresCount ) { return }

    	this.rightExpression.validate({
    		target: object,
    		validationResult: validationResult,
    	})
    }
}

module.exports = Classification.define(AndThenExpression)