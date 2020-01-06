const Classification = require('../Classification')
const OInstance = require('../OInstance')
const Assertion = require('./Assertion')

/*
    Class(`
        This Classification defines the built in assertions of the AssertionCompiler
        object.
    `)
*/
class ContentsAssertionDSL {
    static definition() {
        this.instanceVariables = []
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is an empty Array or String.
        `)
    */
    isEmpty() {
        const assertion = Assertion.new({
            id: 'isEmpty',
            assertWith: function(value) {
                if( Array.isArray(value) ) {
                    return value.length === 0
                }

                if( typeof(value) === 'string' ) {
                    return value === ''
                }

                return false
            },
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is not an empty Array or String.
        `)
    */
    isNotEmpty() {
        const assertion = Assertion.new({
            id: 'isNotEmpty',
            assertWith: function(value) {
                if( Array.isArray(value) ) {
                    return value.length > 0
                }

                if( typeof(value) === 'string' ) {
                    return value !== ''
                }

                return true
            },
        })

        this.addAssertion({ assertion: assertion })

        return this
    }
}

module.exports = Classification.define(ContentsAssertionDSL)