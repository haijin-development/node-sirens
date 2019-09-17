const Classification = require('../../o-language/classifications/Classification')
const Model = require('./Model')

class ValueModelBehaviour {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Model]
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

    /// Triggering

    triggerValueChanged({ oldValue: oldValue, newValue: newValue }) {
        this.emit('value-changed', { oldValue: oldValue, newValue: newValue })
    }
}

module.exports = Classification.define(ValueModelBehaviour)