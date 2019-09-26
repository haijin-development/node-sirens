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

    initialize({ object: object, prop: prop } = { object: undefined, prop: undefined }) {
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
        const oldValue = this.doGetValue()

        this.prop = newProp

        const newValue = this.doGetValue()

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    doSetValue(newValue) {
        this.object[ this.prop ] = newValue
    }
}

module.exports = Classification.define(ObjectPropModel)