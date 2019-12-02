const Classification = require('../../O').Classification
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelBehaviour = require('./ValueModelBehaviour')

class BufferedAttributeModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'attributeReader', 'attributeValue']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol_Implementation]
    }

    /// Initializing

    initialize(
        { object: object, attributeReader: attributeReader }
        =
        { object: null, attributeReader: null }
    ) {
        if( object === undefined ) { object = null }
        if( attributeReader === undefined ) { attributeReader = null }

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
        if( newObject === undefined ) { newObject = null }

        const oldValue = this.doGetValue()

        this.object = newObject

        this.attributeValue = this.doGetObjectAttributeValue()

        const newValue = this.doGetValue()

        this.announceValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    setAttributeReader(closure) {
        const oldValue = this.doGetValue()

        this.attributeReader = closure

        this.attributeValue = this.doGetObjectAttributeValue()

        const newValue = this.doGetValue()

        this.announceValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    doSetValue(newValue) {
        if( newValue === undefined ) { newValue = null }

        this.attributeValue = newValue
    }

    doGetObjectAttributeValue() {
        if( this.attributeReader === null ) { return }

        return this.attributeReader( this.object )
    }
}

module.exports = Classification.define(BufferedAttributeModel)