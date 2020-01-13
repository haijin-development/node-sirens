const Classification = require('../Classification')
const NullAssertionCompiler = require('./NullAssertionCompiler')

/*
    Class(`
        This object collects the parameters of a method call in the same order as the
        validations on them were declared.

        For example the declared assertions:

            append({ string: string, if: condition }) {
                this.param(string) .isString()
                this.param(condition) .isBoolean()
            }

        evaluates the validation first for the string parameter and then for the
        condition paramter.

        It could also be a method call with positional parameters:

            append( string, condition ) {
                this.param(string) .isString()
                this.param(condition) .isBoolean()
            }

        In both cases in the assertions DSL the name of the parameter is not used, only
        the object itself.

        In the expression

            this.param(string) .isString()

        the name of the variable 'string' is only visible to the javascript interpreter,
        not to the method as it is.

        If the assertions are evaluated during its declaration that is not a problem
        since the method

                this.param(string)

        receives the object String to validate it immediatly.

        When the assertions are precompiled and stored for later evaluation then the
        value pointed by the variable 'string' in the declaration is not the value that
        will be validated in later calls to the precompiled assertion.

        On every call the new parameter must be given to the CompiledAssertion to validate
        it.

        This object evaluates the same expression that compiled the CompiledAssertion to
        collect the parameters in the correct order to pass them along to the
        CompiledAssertion.

        Doing this allows to compile the CompiledAssertion only once, something that
        can be slow and can create a lot of intermediate objects if the expression is
        complex, and to evaluate the same CompiledAssertions to validate many different
        parameters of the same method.
    `)
*/
class MethodCallConstraintsParamsCollector {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = ['paramsToValidate']
        this.assumes = []
    }

    /// Initializing

    /*
     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.paramsToValidate = []
    }

    /*
        Method(`
            Returns an array with the params to validate in the same exact order
            as the validations are going to be evaluated.
        `)
    */
    getParamsToValidate() {
        return this.paramsToValidate
    }

    /// Collecting

    /*
        Method(`
            Collects the received parameter to pass it along to the CompiledAssertions.

            Returns a NullAssertionCompiler since this object is interested only in the
            param of the validation and not in the assertions declared after the param.
        `)
    */
    param(paramValue) {
        this.paramsToValidate.push( paramValue )

        return NullAssertionCompiler.new()
    }

    /*
        Method(`
            This implementation is only to be polimorphic with
            MethodCallConstraintsValidator but does nothing since it does not involve
            any parameter of the method call.
        `)
    */
    preCondition(closure) {
    }

    /*
        Method(`
            This implementation is only to be polimorphic with
            MethodCallConstraintsValidator but does nothing since it does not involve
            any parameter of the method call.
        `)
    */
    postCondition(closure) {
    }

    /*
        Method(`
            This implementation is only to be polimorphic with
            MethodCallConstraintsValidator but does nothing since it does not involve
            any parameter of the method call.
        `)
    */
    invariant(closure) {
    }
}

module.exports = Classification.define(MethodCallConstraintsParamsCollector)
