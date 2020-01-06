const Classification = require('../Classification')
const Assertion = require('./Assertion')

/*
    Class(`
        This Classification defines the built in assertions of the AssertionCompiler
        object.
    `)
*/
class TypesAssertionsDSL {
    static definition() {
        this.instanceVariables = []
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is undefined.
        `)
    */
    isUndefined() {
        const assertion = Assertion.new({
            id: 'isUndefined',
            assertWith: function(value) {
                return value === undefined
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is not undefined.
        `)
    */
    isNotUndefined() {
        const assertion = Assertion.new({
            id: 'isNotUndefined',
            assertWith: function(value) {
                return value !== undefined
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is null.
        `)
    */
    isNull() {
        const assertion = Assertion.new({
            id: 'isNull',
            assertWith: function(value) {
                return value === null
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is not null.
        `)
    */
    isNotNull() {
        const assertion = Assertion.new({
            id: 'isNotNull',
            assertWith: function(value) {
                return value !== null
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is a String.
        `)
    */
    isString() {
        const assertion = Assertion.new({
            id: 'isString',
            assertWith: function(value) {
                return typeof(value) === 'string'
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is an Integer.
        `)
    */
    isInteger() {
        const assertion = Assertion.new({
            id: 'isInteger',
            assertWith: function(value) {
                return Number.isInteger(value)
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is an Integer or a Float.
        `)
    */
    isNumber() {
        const assertion = Assertion.new({
            id: 'isNumber',
            assertWith: function(value) {
                return typeof(value) === 'number'
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is true or false.
        `)
    */
    isBoolean() {
        const assertion = Assertion.new({
            id: 'isBoolean',
            assertWith: function(value) {
                return value === true || value === false
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is an Array.
        `)
    */
    isArray() {
        const assertion = Assertion.new({
            id: 'isArray',
            assertWith: function(value) {
                return Array.isArray(value)
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is an Object.
        `)
    */
    isObject() {
        const assertion = Assertion.new({
            id: 'isObject',
            assertWith: function(value) {
                return value !== null && typeof(value) === 'object' && ! Array.isArray(value)
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is a Function.
        `)
    */
    isFunction() {
        const assertion = Assertion.new({
            id: 'isFunction',
            assertWith: function(value) {
                return typeof(value) === 'function'
            }
        })

        this.addAssertion({ assertion: assertion })

        return this
    }
}

module.exports = Classification.define(TypesAssertionsDSL)