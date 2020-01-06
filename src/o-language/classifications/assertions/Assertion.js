const Classification = require('../Classification')

/*
    Class(`
        An Asssertion is an expression that when evaluated on a target object returns
        whether the target object satisfies the expression asserted or not.

        It is possible to chain and to combine many Assertions with logical operators 
        to build a compound expression of Assertions to evaluate later on one or
        more target objects.

        The result of evaluating a compiled Assertion expression on a target object is a
        ValidationResult object containing the failed assertions on the target object.
    `)
*/
class Assertion {
    static definition() {
        this.instanceVariables = ['id', 'assertionClosure', 'data']
    }

    initialize({ id: id, assertWith: assertionClosure, data: data }) {
        this.id = id
        this.assertionClosure = assertionClosure
        this.data = data ? data : {}
    }

    /*
        Method(`
            Returns the id of this Assertion.
        `)
    */
    getId() {
        return this.id
    }

    /*
        Method(`
            Returns the extra data of this assertion such as an expected range or pattern.
        `)
    */
    getData() {
        return this.data
    }

    /*
        Method(`
            Validates that the given object satisfies this Assertion.

            If it does not it adds a ValidationFailure to the given validationResult.

            Does not throw an error and returns undefined.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
        const isValid = this.assertionClosure(object)

        if( isValid !== true ) {
            validationResult.addFailedValidationFrom({
                validationId: this.id,
                validatedValue: object,
                validationData: this.data,
            })
        }
    }
}

module.exports = Classification.define(Assertion)