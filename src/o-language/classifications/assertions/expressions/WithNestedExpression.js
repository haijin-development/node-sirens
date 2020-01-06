const Classification = require('../../Classification')

/*
    Class(`
        A WithNestedExpression models an Assertion on a nested object referred by the
        main object.

        The nested object may be the value of a property owned by the main object or
        an object getted through a getter method. In both cases the nested value is
        getted using the given nestedValueGetter.

        When a WithNestedExpression is evaluated it validates the assertions in the
        nestedCompiledExpression on the nested object.
    `)
*/
class WithNestedExpression {
	static definition() {
		this.instanceVariables = ['nestedValueGetter', 'nestedCompiledExpression']
	}

	initialize({ nestedValueGetter: nestedValueGetter, nestedCompiledExpression: nestedCompiledExpression }) {
        this.nestedValueGetter = nestedValueGetter
		this.nestedCompiledExpression = nestedCompiledExpression
	}

	// Asking

	isWithNestedExpression() {
		return true
	}

	// Accessing

    getId() {
        return 'withNested'
    }

	// Validating

    /*
        Method(`
            Validates that the nested value from the given target object satisfies the
            nestedCompiledExpression.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
        const nestedObject = this.getNestedObjectFrom({ target: object })

        const nestedValidationResult = this.nestedCompiledExpression.validate({
            target: nestedObject
        })

        const failedValidations = nestedValidationResult.getFailedValidations()

        for( const eachValidationFailure of failedValidations ) {
            const failedValidationId = eachValidationFailure.getFailedValidationId()

            const nestedId = `target.${this.nestedValueGetter}.${failedValidationId}`

            const validationFailure = eachValidationFailure.copyWith({
                    id: nestedId,
                    object: object,
                })

            validationResult.addValidationFailure({ validationFailure: validationFailure })
        }
    }

    getNestedObjectFrom({ target: object }) {
        const getter = this.nestedValueGetter

        if( typeof( getter ) === 'string' ) {
            return object[ getter ]
        }

        return getter( object )
    }
}

module.exports = Classification.define(WithNestedExpression)