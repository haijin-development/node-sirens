const Classification = require('../../o-language/classifications/Classification')
const ComponentBehaviour = require('./ComponentBehaviour')

class Widget {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [ComponentBehaviour]
    }

    /// Accessing

    getMainComponent() {
        return this
    }

    /// Child components

    concreteComponentsDo(closure) {
        closure(this)
    }
}

module.exports = Classification.define(Widget)