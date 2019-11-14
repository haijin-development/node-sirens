const Classification = require('../../../O').Classification
const ValueType = require('../../../O').ValueType
const ObjectToTextProtocol = require('../../protocols/ObjectToTextProtocol')
const Resource = require('../Resource')

class PropertyValueToImage {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.implements = [ObjectToTextProtocol]
    }

    /// Displaying

    getDisplayValueFrom({ value: value }) {
        if( value === true ) {
            return Resource.image.true
        }

        if( value === false ) {
            return Resource.image.false
        }

        if( value === undefined  ) {
            return Resource.image.undefined
        }

        if( value === null ) {
            return Resource.image.null
        }

        if( ValueType.isNumber( value ) ) {
            return Resource.image.number
        }

        if( ValueType.isString( value ) ) {
            return Resource.image.string
        }

        if( ValueType.isArray( value ) ) {
            return Resource.image.array
        }

        if( ValueType.isFunction( value ) ) {
            return Resource.image.function
        }

        if( ValueType.isObject( value ) ) {
            return Resource.image.object
        }
    }
}

module.exports = Classification.define(PropertyValueToImage)
