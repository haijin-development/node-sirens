const Classification = require('../Classification')
const ValidationResult = require('./ValidationResult')
const Assertion = require('./Assertion')
const {AssertionCompilerError} = require('../Errors')
const AndThenExpression = require('./expressions/AndThenExpression')
const OrExpression = require('./expressions/OrExpression')
const WithEachExpression = require('./expressions/WithEachExpression')
const WithNestedExpression = require('./expressions/WithNestedExpression')

/*
    Class(`
        A CompiledAssertion is the result of compiling an expression using an
        AssertionCompiler object.

        The CompiledAssertion does not model an assertion itself but it may hold
        an Aseertion expression that, when evaluated on a target object, returns
        the ValidationResult of validating the Assertion expression on the target.

        It can also hold no Assertion expression, meaning that it is a null assertion.
    `)
*/
class CompiledAssertion {
    static definition() {
        this.instanceVariables = ['assertionExpression']
    }

    // Asking

    /*
        Method(`
            Returns true if the current assertionExpression is one of the binary
            connectors .then(), .and(), .or().
        `)

        Tags([
            'implementation'
        ])
    */
    currentExpressionIsABinaryConnector() {
        const expression = this.assertionExpression

        return expression !== undefined
            &&
            (
                expression.respondsTo('isAndThenExpression')
                ||
                expression.respondsTo('isOrExpression')
            )
    }

    // Adding expressions

    /*
        Method(`
            Adds an AndThenExpression to the current assertionExpression.

            The AndThenExpression.leftExpression is set with the current assertionExpression.

            The AndThenExpression.rightExpression is set to null and is defined with the next
            expression in the DSL being evaluated.
        `)
    */
    addAndThenExpression() {
        const thenExpression = AndThenExpression.new({
            leftExpression: this.assertionExpression,
            rightExpression: null,
        })

        this.assertionExpression = thenExpression
    }


    /*
        Method(`
            Adds an OrExpression to the current assertionExpression.

            The leftExpression is set with the current assertionExpression.

            The rightExpression is set to null and it is defined with the next
            expression in the DSL being evaluated.
        `)
    */
    addOrExpression() {
        const andExpression = OrExpression.new({
            leftExpression: this.assertionExpression,
            rightExpression: null,
        })

        this.assertionExpression = andExpression        
    }

    /*
        Method(`
            Adds the given assertion to the current assertionExpression.

            If the current expression is undefined it adds the given assertion
            as the current expression.

            If the current expression is a binary conector ( .then(), .or(), .and() )
            it adds the given assertion as the right expression of the connector.
        `)
    */
    addAssertion({ assertion: assertion }) {
        if( this.currentExpressionIsABinaryConnector() ) {
            this.assertionExpression.setRightExpression( assertion )

            return
        }

        if( this.assertionExpression !== undefined ) {
            this.addAndThenExpression()
            this.assertionExpression.setRightExpression( assertion )

            return
        }

        this.assertionExpression = assertion
    }

    /*
        Method(`
            Creates a WithEachExpression from the given eachCompiledExpression and
            adds it to the current assertionExpression.
        `)
    */
    addWithEachExpression({ eachCompiledExpression: eachCompiledExpression }) {
        const withEachExpression = WithEachExpression.new({
            eachCompiledExpression: eachCompiledExpression
        })

        this.addAssertion({ assertion: withEachExpression })
    }

    /*
        Method(`
            Creates a WithNestedExpression from the given nestedCompiledExpression and
            adds it to the current assertionExpression.
        `)
    */
    addWithNestedExpression({
        nestedValueGetter: nestedValueGetter, nestedCompiledExpression: nestedCompiledExpression
    }) {
        const withNestedExpression = WithNestedExpression.new({
            nestedValueGetter: nestedValueGetter,
            nestedCompiledExpression: nestedCompiledExpression,
        })

        this.addAssertion({ assertion: withNestedExpression })
    }

    // Validating

    /*
        Method(`
            Validates the given object with the assertions defined in this expression.

            Returns a ValidationResult object holding the ValidationFailures found during
            the evaluation of the assertions.
        `)
    */
    validate({ target: object, validationResult: validationResult }) {
        if( validationResult === undefined ) {
            validationResult = ValidationResult.new()
        }

        this.assertionExpression.validate({
            target: object,
            validationResult: validationResult,
        })

        return validationResult
    }

    // Raising errors

    /*
        Method(`
            Throws an AssertionCompilerError error with the given message.
        `)

        Tags([
            'implementation', 'raising errors',
        ])
    */
    throwExpressionError({ message: message }) {
        throw new AssertionCompilerError( message )
    }
}

module.exports = Classification.define(CompiledAssertion)