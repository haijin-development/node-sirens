const Classification = require('../Classification')
const CompiledAssertion = require('./CompiledAssertion')
const TypesAssertionsDSL = require('./TypesAssertionsDSL')
const OTypesDSL = require('./OTypesDSL')
const ContentsAssertionDSL = require('./ContentsAssertionDSL')

/*
    Class(`
        An AssertionCompiler evaluates a DSL closure and compiles it
        to a CompiledAssertion object.

        The DSL expresses the assertions to compile.

        The result of the compilation is a CompiledAssertion that can be stored and used
        later to validate one or more objets.

        The definition of the built in assertions is in the classification
        TypesAssertionsDSL.

        It is possible to add more custom assertions attaching a Classification to an 
        instance of an AssertionCompiler in the same was as the built in types
        classifications are defined here.
    `)
*/
class AssertionCompiler {
    static definition() {
        this.instanceVariables = ['compiledAssertion']
        this.assumes = [TypesAssertionsDSL, OTypesDSL, ContentsAssertionDSL]
    }

    afterInstantiation() {
        this.compiledAssertion = CompiledAssertion.new()
    }

    /*
        Method(`
            Returns the CompiledAssertion.
            With the returned CompiledAssertion it is possible to evaluate its assertions
            to validate one or more objects.
        `)
    */
    getCompiledAssertion() {
        return this.compiledAssertion
    }

    /*
        Method(`
            Evaluates the given assertionExpressionClosure and returns a CompiledAssertion.

            The assertionExpressionClosure expresses the definition of the Assertions
            using a DSL.
        `)
    */
    compile( assertionExpressionClosure ) {
        this.compiledAssertion = CompiledAssertion.new()

        assertionExpressionClosure( this )

        return this.compiledAssertion
    }

    // Expressions

    /*
        Method(`
            Adds the Assertion to the CompiledExpression.
        `)
    */
    addAssertion({ assertion: assertion }) {
        this.compiledAssertion.addAssertion({ assertion: assertion })
    }

    /*
        Method(`
            Compiles an expression that models a logical 'and then'
            ( left expression => right expression ), commonly expressed in js
            with the '&&' operator.

            When a AndThenExpression is evaluated on a target object it first evaluates
            its left expression. If the assertions passes then it evaluates its right
            expression.

            If the assertion on the left expression fails a ValidationFailure is added
            to the ValidationResult and the right expression is not evaluated.

            If you want to always evaluate both left and right expressions use .and()
            instead.
        `)
    */
    andThen() {
        this.compiledAssertion.addAndThenExpression()

        return this
    }

    /*
        Method(`
            Compiles an expression that models a logical

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
    or() {
        this.compiledAssertion.addOrExpression()

        return this
    }

    /*
        Method(`
            Compiles the given eachClosure to validate the CompiledAssertions on each
            item of a given target iterable.
        `)
    */
    withEach(eachClosure) {
        const newAssertionCompiler = this.thisClassification().new()

        const eachCompiledExpression = newAssertionCompiler.compile( eachClosure )

        this.compiledAssertion.addWithEachExpression({
            eachCompiledExpression: eachCompiledExpression,
        })

        return this
    }

    /*
        Method(`
            Compiles the given nestedObjectClosure to validate the property referred by
            the given propertyNameOrClosure.
        `)
    */
    with(propertyNameOrClosure, nestedObjectClosure) {
        const newAssertionCompiler = this.thisClassification().new()

        const nestedCompiledExpression = newAssertionCompiler.compile( nestedObjectClosure )

        this.compiledAssertion.addWithNestedExpression({
            nestedValueGetter: propertyNameOrClosure,
            nestedCompiledExpression: nestedCompiledExpression,
        })

        return this
    }
}

module.exports = Classification.define(AssertionCompiler)