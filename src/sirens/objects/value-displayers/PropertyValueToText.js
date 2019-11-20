const Classification = require('../../../O').Classification
const ValueType = require('../../../O').ValueType
const ObjectToTextProtocol = require('../../protocols/ObjectToTextProtocol')

class PropertyValueToText {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.implements = [ObjectToTextProtocol]
    }

    /// Displaying

    getDisplayValueFrom({ value: value }) {
        let description = null

        if( value === undefined ) {
            return "undefined"
        }

        if( value === null ) {
            return "null"
        }

        if( ValueType.isArray( value ) ) {
            description = `Array(${value.length})`
        }

        if( ValueType.isString( value ) ) {
            return `"${value}"`
        }

        if( ValueType.isObject( value ) ) {
            if(value.constructor !== undefined) {
                description = `${value.constructor.name}`
            } else {
                description = 'object'
            }

        }

        if( ValueType.isFunction( value ) ) {
            description = "function"
            if (value.name !== undefined) {
                description += " named '" + value.name + "'"
            }
        }

        if(description === null) {
            description = value.toString()
        }

        if( ValueType.isNumber( value ) ) {
            return description
        }

        if( ValueType.isBoolean( value ) ) {
            return description
        }

        if(['a', 'e', 'i', 'o', 'A', 'E', 'I', 'O'].includes(description[0])) {
            description = 'an ' + description
        } else {
            description = 'a ' + description
        }

        return description
    }
}

module.exports = Classification.define(PropertyValueToText)
