const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviour = require('./ComponentBehaviour')

const Widget = Classification.define( class {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [ComponentBehaviour]
    }

    /// Accessing

    getMainComponent() {
        return this
    }
})

module.exports = Widget