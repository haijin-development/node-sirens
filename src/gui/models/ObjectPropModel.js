const Classification = require('../../o-language/classifications/Classification')
const ValueModelBehaviour = require('./ValueModelBehaviour')
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')

class ObjectPropModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['object', 'prop']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol_Implementation, ValueModelProtocol]
    }

    /// Initializing

    initialize({ object: object, prop: prop } = { object: null, prop: null }) {
        if( object === undefined ) { object = null }
        if( prop === undefined ) { prop = null }

        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.object = object
        this.prop = prop
    }

    /// Reading

    doGetValue() {
        return this.object[ this.prop ]
    }

    getObject() {
        return this.object
    }

    getProp() {
        return this.prop
    }

    /// Writing

    setObject(newObject) {
        const oldValue = this.doGetValue()

        this.object = newObject

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    setProp(newProp) {
        if( newProp === undefined ) { newProp = null }

        const oldValue = this.doGetValue()

        this.prop = newProp

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    doSetValue(newValue) {
        if( newValue === undefined ) { newValue = null }

        this.object[ this.prop ] = newValue
    }
}

module.exports = Classification.define(ObjectPropModel)