const Classification = require('../../o-language/classifications/Classification')
const ValueModelBehaviour = require('./ValueModelBehaviour')
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class ObjectAttributeModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'attributeReader', 'attributeWriter']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol_Implementation, ValueModelProtocol]
    }

    /// Initializing

    initialize(
        { object: object, attributeReader: attributeReader, attributeWriter: attributeWriter }
        =
        { object: null, attributeReader: null, attributeWriter: null }
    ) {
        if( object === undefined ) { object = null }
        if( attributeReader === undefined ) { attributeReader = null }
        if( attributeWriter === undefined ) { attributeWriter = null }

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.object = object
        this.attributeReader = attributeReader
        this.attributeWriter = attributeWriter
    }

    /// Reading

    doGetValue() {
        if( this.attributeReader === null ) { return }

        return this.attributeReader( this.object )
    }

    getObject() {
        return this.object
    }

    getAttributeReader() {
        return this.attributeReader
    }

    getAttributeWriter() {
        return this.attributeWriter
    }

    /// Writing

    setObject(newObject) {
        if( newObject === undefined ) { newObject = null }

        const oldValue = this.doGetValue()

        this.object = newObject

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    setAttributeReader(closure) {
        const oldValue = this.doGetValue()

        this.attributeReader = closure

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    setAttributeWriter(closure) {
        const oldValue = this.doGetValue()

        this.attributeWriter = closure

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    doSetValue(newValue) {
        if( newValue === undefined ) { newValue = null }
        if( this.attributeWriter === null ) { return }

        this.attributeWriter( this.object, newValue )
    }
}

module.exports = Classification.define(ObjectAttributeModel)