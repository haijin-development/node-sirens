const Classification = require('../../O').Classification
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const Model = require('./Model')

class ValueModelBehaviour {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Model]
        this.expects = [ValueModelProtocol_Implementation]
    }

    /// Reading

    getValue() {
        return this.doGetValue()
    }

    /// Writing

    setValue(newValue) {
        if( this.isSameValue( newValue ) ) {
            return
        }

        const oldValue = this.doGetValue()

        this.doSetValue( newValue )

        this.triggerValueChanged({ oldValue: oldValue, newValue: newValue })
    }

    /// Comparing

    isSameValue(newValue) {
        return this.doGetValue() === newValue
    }

    /// Listening

    /*
        Encapsulate the binding to the value changed event to:
            - encapsulate all the trigger-listen logic in this classification
            - allow polimorphism with other possible implementations of the observer pattern
            - drop the need of listeners to be aware of the naming conventions of the events
            - define a unique and well documented common protocol for listeners and models to comply with
    */
    onValueChanged(closure) {
        this.on('value-changed', closure)

        return this
    }

    /// Triggering

    triggerValueChanged({ oldValue: oldValue, newValue: newValue }) {
        this.emit('value-changed', { oldValue: oldValue, newValue: newValue })
    }
}

module.exports = Classification.define(ValueModelBehaviour)