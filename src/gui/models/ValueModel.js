const Classification = require('../../o-language/classifications/Classification')
const ValueModelProtocol_Implementation = require('../protocols/ValueModelProtocol_Implementation')
const ValueModelProtocol = require('../protocols/ValueModelProtocol')
const ValueModelBehaviour = require('./ValueModelBehaviour')

class ValueModel {
    /// Definition

    static definition() {
        this.instanceVariables = ['value']
        this.assumes = [ValueModelBehaviour]
        this.implements = [ValueModelProtocol, ValueModelProtocol_Implementation]
    }

    /// Initializing

    initialize({ value: value } = { value: null }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

        this.value = value
    }

    /// Reading

    doGetValue() {
        return this.value
    }

    /// Writing

    doSetValue(newValue) {
        this.value = newValue
    }
}

module.exports = Classification.define(ValueModel)