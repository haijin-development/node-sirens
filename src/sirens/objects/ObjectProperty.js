const Classification = require('../../O').Classification
const ObjectWithNamespace = require('../../O').ObjectWithNamespace
const ValueType = require('../../O').ValueType

/*
    Class(`
        This object models a (key, value) pair of an object property.

        For example the object

            user = {
                name: 'John'
            }

        has the pair {key: 'name', value: 'John'}.

        The ObjectProperty answers its child ObjectProperties and can be used
        to inspect an object in a browsable tree. Also it handles indexed properties
        in the case of Arrays.

        This is the default implementation of an ObjectsProperties but additional
        classifications may be attached to this object to extend, modify or filter
        the properties and its displayable formats.

        The attachment of additional classifications is done by the ObjectPropertyPlugins
        object.
    `)
*/
class _ObjectProperty {
    /// Definition

    static definition() {
        this.instanceVariables = ['key', 'value']
        this.assumes = [ObjectWithNamespace]
    }

    /// Initializing

    initialize({ key: key, value: value }) {
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
            const objectPropertyPlugins =
                this.namespace().ObjectPropertyPlugins.new()

            return objectPropertyPlugins.newObjectProperty({
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

            const objectPropertyPlugins =
                this.namespace().ObjectPropertyPlugins.new()

            const instVar = objectPropertyPlugins.newObjectProperty({
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
        const displayer = this.namespace().PropertyValueToText.new()

        return displayer.getDisplayValueFrom({ value: this.value })
    }

    icon() {
        const displayer = this.namespace().PropertyValueToImage.new()

        return displayer.getDisplayValueFrom({ value: this.value })
    }
}

ObjectProperty = Classification.define(_ObjectProperty)

module.exports = ObjectProperty
