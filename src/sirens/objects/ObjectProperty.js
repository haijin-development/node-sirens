const path = require('path')
const Classification = require('../../o-language/classifications/Classification')
const Resource = require('./Resource')

class ObjectProperty {
    /// Definition

    static definition() {
        this.instanceVariables = ['key', 'value']
    }

    /// Initializing

    initialize({ key: key, value: value }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.key = key
        this.value = value
    }

    /// Accessing

    getKey() {
        return this.key
    }

    getValue() {
        return this.value
    }

    /// Querying

    getChildProperties() {
        if( this.isArray() ) {
            return this.getArrayIndexedProperties()
        }

        if( this.isObject() ) {
            return this.getObjectProperties()
        }

        return []
    }

    getArrayIndexedProperties() {
        return this.value.map( (item, index) => {
            return this.thisClassification().new({
                key: index,
                value: item
            })
        })
    }

    getObjectProperties() {
        const instVars = []

        const object = this.value

        for (const key in object) {
            const instVarValue = object[key]

            if(typeof instVarValue === 'function') {
                continue
            }

            const instVar = this.thisClassification().new({
                key: key,
                value: instVarValue
            })

            instVars.push(instVar)
        }

        return instVars
    }

    valueType() {
        return typeof this.value
    }

    isArray() {
        return Array.isArray(this.value)
    }

    isString() {
        return this.valueType() === 'string'
    }

    isObject() {
        return this.valueType() === 'object'
    }

    isFunction() {
        return this.valueType() === 'function'
    }

    isNumber() {
        return this.valueType() === 'number' || this.valueType() === 'bigint'
    }

    isBoolean() {
        return this.valueType() === 'boolean'
    }

    isNull() {
        return this.value === null
    }

    isUndefined() {
        return this.value === undefined
    }

    /// Displaying

    displayString() {
        let string = ''

        if (this.key !== null) {
            string += this.keyDisplayString() + ' = '
        }

        string += this.valueDisplayString()

        return string
    }

    keyDisplayString() {
        if( typeof this.key === 'number' ) {
            return `[${this.key.toString()}]`
        } else {
            return this.key.toString()
        }
    }

    valueDisplayString() {
        let description = null

        if(this.isUndefined()) {
            return "undefined"
        }

        if(this.isNull()) {
            return "null"
        }

        if(this.isArray()) {
            description = `Array(${this.value.length})`
        }

        if(this.isString()) {
            return `"${this.value}"`
        }

        if(this.isObject()) {
            if(this.value.constructor !== undefined) {
                description = `${this.value.constructor.name}`
            } else {
                description = 'object'
            }

        }

        if(this.isFunction()) {
            description = "function"
            if (this.value.name !== undefined) {
                description += " named '" + this.value.name + "'"
            }
        }

        if(description === null) {
            description = this.value.toString()
        }

        if(this.isNumber() || this.isBoolean()) {
            return description
        }

        if(['a', 'e', 'i', 'o', 'A', 'E', 'I', 'O'].includes(description[0])) {
            description = 'an ' + description
        } else {
            description = 'a ' + description
        }

        return description
    }

    icon() {
        if(this.value === true) {
            return Resource.image.true
        }

        if(this.value === false) {
            return Resource.image.false
        }

        if(this.isUndefined()) {
            return Resource.image.undefined
        }

        if(this.isNull()) {
            return Resource.image.null
        }

        if(this.isNumber()) {
            return Resource.image.number
        }

        if(this.isString()) {
            return Resource.image.string
        }

        if(this.isArray()) {
            return Resource.image.array
        }

        if(this.isFunction()) {
            return Resource.image.function
        }

        if(this.isObject()) {
            return Resource.image.object
        }
    }
}

module.exports = Classification.define(ObjectProperty)