const Classification = require('../Classification')
const MethodCallConstraintsValidatorProtocol = require('../../protocols/MethodCallConstraintsValidatorProtocol')
const ObjectValidation = require('./ObjectValidation')
const AssertionCompiler = require('../assertions/AssertionCompiler')
const MethodCallConstraintsParamsCollector = require('./MethodCallConstraintsParamsCollector')

/*
    Class(`
       This classification collects and evaluates the constraints that a receiver object and the
       parameters of a method called are expected to have before and after the activation of the
       method call.
    `)

    Tags([
       'definition', 'implementation'
    ])
*/
class MethodCallConstraintsValidator {
    /// Definition

    /*
        Tags([
            'definition', 'implementation'
        ])
    */
    static definition() {
        this.instanceVariables = [
            'paramsValidations',
            'preConditionValidations',
            'postConditionValidations',
            'temporaryAssertionCompiler',
        ]
        this.assumes = []
        this.implements = [MethodCallConstraintsValidatorProtocol]
    }

    /// Initializing

    /*
     Tags([
        'initializing', 'implementation'
     ])
    */
    afterInstantiation() {
        this.paramsValidations = []
        this.preConditionValidations = []
        this.postConditionValidations = []
    }

    /*
        Method(`
            Adds the given objectValidation to the collection of validations to evaluate on
            this method call.
            The given objectValidation holds the CompiledAssertions to evaluate on
            the parameter object.
        `)

        Tags([
            'implementation', 'adding'
        ])
    */
    addParamValidation(objectValidation) {
        this.paramsValidations.push( objectValidation )
    }

    /*
        Method(`
            Adds the given objectValidation to the collection of validations to evaluate
            before the activation of this method call.
            The given objectValidation holds the CompiledAssertions to evaluate on
            the receiver of the method.
        `)

        Tags([
            'implementation', 'adding'
        ])
    */
    addPreConditionValidation(objectValidation) {
        this.preConditionValidations.push( objectValidation )
    }

    /*
        Method(`
            Adds the given objectValidation to the collection of validations to evaluate
            after the activation of this method call.
            The given objectValidation holds the CompiledAssertions to evaluate on
            the receiver of the method.
        `)

        Tags([
            'implementation', 'adding'
        ])
    */
    addPostConditionValidation(objectValidation) {
        this.postConditionValidations.push( objectValidation )
    }

    /// Validations

    /*
        Method(`
            This method is called in the following context:

                append({ string: string, if: condition }) {
                    this.param(string) .isString()
                }

            The method creates a new temporary AssertionCompiler, keeps it in the
            instance variable this.temporaryAssertionCompiler and returns it.

            This temporaryAssertionCompiler will compile the assertions following the
            param(...) declaration. In the example above it will compile the expression

                    .isString()

            The caller of this method then *must* call the method

                    this.endCurrentAssertionCompilation()

            to attach the last CompiledAssertion to the last ObjectValidation.

            The call to

                    .endCurrentAssertionCompilation()

            is necessary because this method does not have the context to know which
            one is the last assertion to compile unless the DSL required to define a
            scope or to include an explicit ending expression but that adds noise
            to the DSL expressiveness.

            Compare the following expressions:

                append({ string: string, if: condition }) {
                    this.assertThat({
                        param: string,
                        fulfills: (param) => { param .isString() }
                    })

                    // with

                    this.param(string) .isString()
                }

            The use of this Classification is ackward and error prone but it makes the
            method validation DSL more simple to use and it is an implementation
            mechanism, not a public interface.
        `)

        Tags([
            'public', 'dsl'
        ])
    */
    param(paramValue) {
        this.endCurrentAssertionCompilation()

        this.temporaryAssertionCompiler = AssertionCompiler.new()

        return this.temporaryAssertionCompiler
    }

    /*
        Method(`
            Creates and adds a method pre condition validation.

            A method pre condition is a state that the object is expected to satisfy
            before activating the method.

            For example if an object has a numeric instance variable named n and a
            method makes a division by n value

                    calculateSomething(i) {
                        return i / this.n
                    }

            a precondition of the method is that this.n is different than 0,
            othewise the method will throw an division by 0 error or return an undefined
            value.

            The assertion of such precondition can be done with

                    calculateSomething(i) {
                        this.param(i) .isInteger()

                        this.preCondition( function(receiver) => {
                            receiver.assert( 'N not zero', (object) => {
                                return object.getN() !== 0
                            })
                        })
                    }

            Another example of a pre-condition is that an instance variable of
            type Array that is accessed during a method call is not empty nor null:

                    calculateSomething(i) {
                        this.param(i) .isInteger()

                        this.preCondition( function(receiver) => {
                            receiver.assert( 'Items not empty', (object) => {
                                return object.getItems().length > 0
                            })
                        })
                    }
        `)
    */
    preCondition(assertionClosure) {
        const temporaryAssertionCompiler = AssertionCompiler.new()

        assertionClosure( temporaryAssertionCompiler )

        const compiledAssertion = temporaryAssertionCompiler.getCompiledAssertion()

        const receiverValidation = ObjectValidation.new({
            compiledAssertion: compiledAssertion
        })

        this.addPreConditionValidation(receiverValidation)
    }

    /*
        Method(`
            Creates and adds a method post condition validation.

            A method post condition is a state that the object is expected to satisfy
            after the method call evaluation.

            For example if an object has a numeric instance variable named n and a
            method makes a division by n value

                    calculateSomething(i) {
                        return i / this.n
                    }

            a post-condition of a setter of this.n is that this.n be different than 0,
            otherwise the method will throw an division by 0 error or return an undefined
            value when used as a dividend.

            The assertion of such postCondition can be done with

                    setN(n) {
                        this.param(n) .isInteger()

                        this.postCondition( function(receiver) => {
                            receiver
                                .assert( (object) => { return object.getN() !== 0 } )
                        })
                    }
        `)
    */
    postCondition(assertionClosure) {
        const temporaryAssertionCompiler = AssertionCompiler.new()

        assertionClosure( temporaryAssertionCompiler )

        const compiledAssertion = temporaryAssertionCompiler.getCompiledAssertion()

        const receiverValidation = ObjectValidation.new({
            compiledAssertion: compiledAssertion
        })

        this.addPostConditionValidation(receiverValidation)
    }

    /*
        Method(`
            Creates and adds a method invariant validation.

            A method invariant condition is a state that the object is expected to satisfy
            after and before the evaluation of the method call.

            For example if an object has a numeric instance variable named n and a
            method makes a division by n value

                    calculateSomething(i) {
                        return i / this.n
                    }

            and another method that modifies the value of this.n

                    decreaseValueN({ by: i }) {
                        this.n -= i
                    }

            the latter method would had the invariant the this.n be different that 0
            after and before the variable assingment. Otherwise the method calculateSomething
            might raise an error or returned an undefined value.

            Note that the validation of the preCondition and postCondition is not possible
            considering only the given parameter i, it is a combination of the current
            state of the object (the value of this.n) with the given parameter
            (the value of i).

            Also note that this example is a simple assignment to an instance variable
            but a method might evaluate complex loops, conditional statements and
            calls to other calculations that might modify the state of the object
            (the value of this.n) and which is not possible to validate in advance only
            with a static check of the methods and variables signatures, not even using
            sophisticated type and value inference, since some values might be
            non-deterministic values like

                    decreaseNByTheCurrentTime() {
                        this.n -= this.getNumberOfSecondsFromTheBeginningOfDay()
                    }

            Expressing the assertions as an invariant on the state of the object 
            receiving the method call both simplifies the logic of the validations
            and states in a clear and expressive idiom which is the valid state of
            the object before and after evaluating the method no matter what the
            method does in between.

            The assertion of such invariant can be done with

                    decreaseValueN({ by: i }) {
                        this.param(i) .isInteger()

                        this.invariant( function(receiver) => {
                            receiver
                                .assert( (object) => { return object.getN() !== 0 } )
                        })
                    }
        `)
    */
    invariant(assertionClosure) {
        this.preCondition( assertionClosure )
        this.postCondition( assertionClosure )
    }

    /// Compiling

    /*
        Method(`
            Evaluate the method of the protocol that validates the method in the classification.
            It would look like
                append({ string: string, if: condition }) {
                param(string) .string()
                param(condition) .undefined() .or() .boolean()
            }
        `)
    */
    compileAssertions({ methodName: methodName, params: params }) {
        this[ methodName ]( ...params )

        this.endCurrentAssertionCompilation()
    }

    /*
        Method(`
            Gets the CompiledAssertion from the current temporaryAssertionCompiler
            that is compiling the assertions and sets the CompiledAssertion to the
            current param validation.

            This method is called if a new

                    .param(...)

            is received since that means that the previous param has no more
            assertion statements, but for the last

                    .param(...)

            expression it must be called explicitly, which is done in the

                    .compileAssertions(...)

            method.

            This method also cleans up the current this.temporaryAssertionCompiler
            and a new one must be created to compile the next assertion.
        `)
    */
    endCurrentAssertionCompilation() {
        if( this.temporaryAssertionCompiler === undefined ) { return }

        const compiledAssertion =
            this.temporaryAssertionCompiler.getCompiledAssertion()

        const paramValidation = ObjectValidation.new({
            compiledAssertion: compiledAssertion
        })

        this.addParamValidation(paramValidation)

        this.temporaryAssertionCompiler = null
    }

    /// Evaluating

    /*
        Method(`
            Evaluates the params CompiledAssertions on all of the parameters of a method
            call.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    evaluateParametersValidationsOn({ methodCallInfo: methodCallInfo, params: params }) {
        const paramsInOrder =
            this.collectParamsToValidateInTheSameOrderAsTheValidationsAreDefined({
                methodName: methodCallInfo.methodName,
                params: params,
            })

        this.paramsValidations.forEach( (eachValidation, i) => {
            const paramValue = paramsInOrder[i]

            eachValidation.validate({
                methodCallInfo: methodCallInfo,
                objectToValidate: paramValue,
            })
        })
    }

    /*
        Method(`
            Evaluates the pre-condition CompiledAssertions on the receiver of the
            method call.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    evaluatePreConditionsValidationsOn({ methodCallInfo: methodCallInfo, receiver: receiver }) {
        this.preConditionValidations.forEach( (eachValidation, i) => {
            eachValidation.validate({
                methodCallInfo: methodCallInfo,
                objectToValidate: receiver,
            })
        })
    }

    /*
        Method(`
            Evaluates the pst-condition CompiledAssertions on the receiver of the
            method call.
        `)

        Tags([
            'public', 'evaluating'
        ])
    */
    evaluatePostConditionsValidationsOn({ methodCallInfo: methodCallInfo, receiver: receiver }) {
        this.postConditionValidations.forEach( (eachValidation, i) => {
            eachValidation.validate({
                methodCallInfo: methodCallInfo,
                objectToValidate: receiver,
            })
        })
    }

    /*
        Method(`
            Collects the parameters to validate in the same order as the validations
            will be evaluated to correctly pass each parameter to validate to each
            precompiled ObjectValidation.
        `)
    */
    collectParamsToValidateInTheSameOrderAsTheValidationsAreDefined({ methodName: methodName, params: params }) {
        const paramsCollector = MethodCallConstraintsParamsCollector.new()

        this[ methodName ].call( paramsCollector, ...params )

        return paramsCollector.getParamsToValidate()
    }
}

module.exports = Classification.define(MethodCallConstraintsValidator)
