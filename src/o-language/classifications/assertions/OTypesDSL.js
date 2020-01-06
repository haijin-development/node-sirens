const Classification = require('../Classification')
const OInstance = require('../OInstance')
const Assertion = require('./Assertion')

/*
    Class(`
        This Classification defines the built in assertions of the AssertionCompiler
        object.
    `)
*/
class OTypesDSL {
    static definition() {
        this.instanceVariables = []
    }

    /*
        Method(`
            Compiles an expression that, when evaluated, Asserts that a given target object
            is undefined.
        `)
    */
    behavesAs(aClassification) {
        const assertion = Assertion.new({
            id: 'behavesAs',
            assertWith: function(value) {
                const isOInstance = OInstance.isOInstance( value )
                return isOInstance && value.isBehavingAs( aClassification )
            },
            data: {
                classification: aClassification
            },
        })

        this.addAssertion({ assertion: assertion })

        return this
    }

    compliesWith(aProtocol) {
        const assertion = Assertion.new({
            id: 'compliesWith',
            assertWith: function(value) {
                const isOInstance = OInstance.isOInstance( value )
                return isOInstance && value.compliesWith( aProtocol )
            },
            data: {
                protocol: aProtocol
            },
        })

        this.addAssertion({ assertion: assertion })

        return this
    }
}

module.exports = Classification.define(OTypesDSL)