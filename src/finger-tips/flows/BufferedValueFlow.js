const Classification = require('../../O').Classification
const ValueFlow = require('./ValueFlow')

class BufferedValueFlow {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'convertToValueClosure']
        this.assumes = [ValueFlow]
    }

    // Accessing

    getObject() {
        return this.object
    }

    setObject(object) {
        this.object = object

        const value = this.convertObjectToValue()

        this.setValue( value )
    }

    setConvertToValueClosure(convertToValueClosure) {
        this.convertToValueClosure = convertToValueClosure

        const value = this.convertObjectToValue()

        this.setValue( value )
    }

    convertObjectToValue() {
        if( ! this.convertToValueClosure ) { return this.object }

        return this.convertToValueClosure({ object: this.object })
    }
}

module.exports = Classification.define(BufferedValueFlow)