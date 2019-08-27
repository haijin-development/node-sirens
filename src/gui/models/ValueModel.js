const Classification = require('../../o-language/classifications/Classification')
const Model = require('./Model')

class ValueModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['value']
        this.assumptions = [Model]
    }

    /// Initializing

    initialize({ value: value } = { value: null }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

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

module.exports = Classification.define(ValueModel)