const path = require('path')
const Classification = require('../../O').Classification
const ValueType = require('../../O').ValueType
const PropertyValueToText = require('./value-displayers/PropertyValueToText')
const PropertyValueToImage = require('./value-displayers/PropertyValueToImage')

class _ObjectProperty {
    /// Definition

    static definition() {
        this.instanceVariables = ['key', 'value']
    }

    /// Initializing

    afterInstantiation() {
        const Pluggables = require('./Pluggables')

        const pluggableClassifications = Pluggables.objectPropertiesInspector.plugins

        this.behaveAsAll( pluggableClassifications )
    }

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
        if( ValueType.isArray( this.value ) ) {
            return this.getArrayIndexedProperties()
        }

        if( ValueType.isObject( this.value ) ) {
            return this.getObjectProperties()
        }

        return []
    }

    getArrayIndexedProperties() {
        return this.value.map( (item, index) => {
            return ObjectProperty.new({
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

            const instVar = ObjectProperty.new({
                key: key,
                value: instVarValue
            })

            instVars.push(instVar)
        }

        return instVars
    }

    isFunction() {
        return ValueType.isFunction( this.value )
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
        if( ValueType.isNumber( this.key ) ) {
            return `[${this.key.toString()}]`
        }

        return this.key.toString()
    }

    valueDisplayString() {
        const displayer = PropertyValueToText.new()

        return displayer.getDisplayValueFrom({ value: this.value })
    }

    icon() {
        const displayer = PropertyValueToImage.new()

        return displayer.getDisplayValueFrom({ value: this.value })
    }
}

ObjectProperty = Classification.define(_ObjectProperty)

module.exports = ObjectProperty
