const Classification = require('../../o-language/classifications/Classification')
const ValueModelBehaviour = require('./ValueModelBehaviour')
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class BufferedAttributeModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'attributeReader', 'attributeValue']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol_Implementation, ValueModelProtocol]
    }

    /// Initializing

    initialize(
        { object: object, attributeReader: attributeReader }
        =
        { object: undefined, attributeReader: undefined }
    ) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.object = object
        this.attributeReader = attributeReader
        this.attributeValue = this.doGetObjectAttributeValue()
    }

    /// Reading

    doGetValue() {
        return this.attributeValue
    }

    getObject() {
        return this.object
    }

    getAttributeReader() {
        return this.attributeReader
    }

    /// Writing

    setObject(newObject) {
        const oldValue = this.doGetValue()

        this.object = newObject

        this.attributeValue = this.doGetObjectAttributeValue()

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    setAttributeReader(closure) {
        const oldValue = this.doGetValue()

        this.attributeReader = closure

        this.attributeValue = this.doGetObjectAttributeValue()

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    doSetValue(newValue) {
        this.attributeValue = newValue
    }

    doGetObjectAttributeValue() {
        if( this.attributeReader === undefined ) { return }

        return this.attributeReader( this.object )
    }
}

module.exports = Classification.define(BufferedAttributeModel)