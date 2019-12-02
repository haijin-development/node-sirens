const Classification = require('../../O').Classification
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const Announcer = require('../announcements/Announcer')

class ValueModelBehaviour {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Announcer]
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

        this.announceValueChanged({ oldValue: oldValue, newValue: newValue })
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
    onValueChanged({ with: object, do: eventHandler }) {
        this.subscribe({
            event: 'value-changed',
            to: object,
            doing: eventHandler,
        })        

        return this
    }

    /// Triggering

    announceValueChanged({ oldValue: oldValue, newValue: newValue }) {
        this.announce({
            event: 'value-changed',
            with: { oldValue: oldValue, newValue: newValue },
        })
    }
}

module.exports = Classification.define(ValueModelBehaviour)