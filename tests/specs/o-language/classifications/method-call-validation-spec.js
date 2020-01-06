const expect = require('chai').expect
const Classification = require('../../../../src/O').Classification
const Protocol = require('../../../../src/O').Protocol
const MethodCallConstraints = require('../../../../src/O').MethodCallConstraints
const Errors = require('../../../../src/O').Errors

describe('When validating parameters', () => {
    describe('with isNull()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isNull()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a null value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( null )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non null value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( undefined )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a null value, got undefined.',
            })
        })
    })

    describe('with notNull()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isNotNull()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a not null value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }).not .to .throw( Error )
        })

        it('the validation fails with a null value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( null )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a non null value, got null.',
            })
        })
    })

    describe('with isUndefined()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isUndefined()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with an undefined value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( undefined )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non undefined value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( null )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected an undefined value, got null.',
            })
        })
    })

    describe('with isNotUndefined()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isNotUndefined()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a non undefined value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }).not .to .throw( Error )
        })

        it('the validation fails with an undefined value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( undefined )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a non undefined value, got undefined.',
            })
        })
    })

    describe('with isBoolean()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isBoolean()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a true value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( true )
            }).not .to .throw( Error )
        })

        it('the validation passes with a false value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( false )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non boolean value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( undefined )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a Boolean, got undefined.',
            })
        })
    })

    describe('with isNumber()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isNumber()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with an integer value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 0 )
            }).not .to .throw( Error )
        })

        it('the validation passes with a float value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 0.1 )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non number value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( '1' )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a Number, got 1.',
            })
        })
    })

    describe('with isInteger()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isInteger()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with an integer value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 0 )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non integer value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1.1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected an Integer, got 1.1.',
            })
        })
    })

    describe('with isString()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isString()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a string value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( '1' )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non string value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1.1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a String, got 1.1.',
            })
        })
    })

    describe('with isArray()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isArray()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with an array value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( [] )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non array value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected an Array, got 1.',
            })
        })
    })

    describe('with isObject()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isObject()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with an object value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( {} )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non object value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected an Object, got 1.',
            })
        })
    })

    describe('with isFunction()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isFunction()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a function value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( function(){} )
            }).not .to .throw( Error )
        })

        it('the validation fails with a non object value', () => {

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected a Function, got 1.',
            })
        })
    })

    describe('with behavesAs()', () => {

        const classififcationToBehaveAs = Classification.define( class classififcationToBehaveAs {

        })

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .behavesAs( classififcationToBehaveAs )
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a param that behaves with the classification', () => {
            const param = classififcationToBehaveAs.new()

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( param )
            }).not .to .throw( Error )
        })

        it('the validation does not pass with a param that does behave as the classification', () => {
            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected value to be behaving as a classififcationToBehaveAs, got 1.',
            })
        })
    })

    describe('with compliesWith()', () => {

        const protocolToComplyWith = Protocol.define( class ProtocolToComplyWith {

        })

        const ParamClassification = Classification.define( class ParamClassification {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocolToComplyWith ]
            }
        })

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .compliesWith( protocolToComplyWith )
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a param that complies with the protocol', () => {
            const param = ParamClassification.new()

            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( param )
            }).not .to .throw( Error )
        })

        it('the validation does not pass with a param that does not comply with the protocol', () => {
            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method expected value to comply with ProtocolToComplyWith, got 1.',
            })
        })
    })

    describe('with or()', () => {

        const protocol = Protocol.define( class AProtocol {
            method(p1) {
                this.param(p1) .isString() .or() .isNull()
            }
        })

        const AClassification = Classification.define( class A {
            static definition() {
                this.instanceVariables = []
                this.assumes = []
                this.implements = [ protocol ]
            }

            method(p1) {
            }
        })

        it('the validation passes with a null', () => {
            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( null )
            }).not .to .throw( Error )
        })

        it('the validation passes with a String', () => {
            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( '' )
            }).not .to .throw( Error )
        })

        it('the validation fails with any other value', () => {
            const object = AClassification.new()
                .behaveAs( MethodCallConstraints )

            expect( () => {
                object.method( 1 )
            }) .to .raise({
                error: Errors.FailedAssertionError,
                withMessage: 'Method AProtocol.method validation failed for all the terms in the .or() expression.',
            })
        })
    })

})