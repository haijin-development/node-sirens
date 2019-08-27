const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviour = require('./ComponentBehaviour')

class Widget {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [ComponentBehaviour]
    }

    /// Accessing

    getMainComponent() {
        return this
    }
}

module.exports = Classification.define(Widget)