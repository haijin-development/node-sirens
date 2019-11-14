const Classification = require('../../../O').Classification
const ObjectToTextProtocol = require('../../protocols/ObjectToTextProtocol')

class PropertyValueToPlaygroundText {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.implements = [ObjectToTextProtocol]
    }

    /// Displaying

    getDisplayValueFrom({ value: value }) {
        if( value === null ) {
            return ''
        }

        if( typeof( value ) === 'function' ) {
            return value.toString()
        }

        try {
            return JSON.stringify(value)
        } catch(error) {
            return value.toString()
        }
    }
}

module.exports = Classification.define(PropertyValueToPlaygroundText)
