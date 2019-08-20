const OInstance = require('../../o-language/classifications/OInstance')
const Model = require('./Model')

class ValueModel {
    /// Instantiating

    static new() {
        return this.with({ value: null })
    }

    static with({ value: value }) {
        return OInstance.new().yourself( (object) => {
            object
                .behaveAs(this)
                .initialize({ value: value })
        })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['value']
        this.assumptions = [Model]
    }

    /// Initializing

    initialize({ value: value }) {
        this.value = value
    }

    getValue() {
        return this.value
    }

    setValue(newValue) {
        if(this.value === newValue) {
            return
        }

        const oldValue = this.value

        this.value = newValue

        this.emit('value-changed', {oldValue: oldValue, newValue: newValue})
    }
}

module.exports = ValueModel