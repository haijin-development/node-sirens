const Classification = require('./Classification')
const OInstance = require('./OInstance')

class ValueType {
    static definition() {
        this.instanceVariables = []
    }

    /// Asking

    isArray(value) {
        return Array.isArray(value)
    }

    isBoolean(value) {
        return typeof(value) === 'boolean'
    }

    isFunction(value) {
        return typeof(value) === 'function'
    }

    isNull(value) {
        return this.value === null
    }

    isNumber(value) {
        return typeof(value) === 'number' || typeof(value) === 'bigint'
    }

    isObject(value) {
        return typeof(value) === 'object'
    }

    isOInstance(value) {
        return OInstance.isOInstance( value )
    }

    isString(value) {
        return typeof(value) === 'string'
    }

    isUndefined(value) {
        return this.value === undefined
    }
}

ValueType = Classification.define(ValueType)

const valueTypeInstace = ValueType.new()

module.exports = valueTypeInstace