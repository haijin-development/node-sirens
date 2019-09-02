const Classification = require('../../o-language/classifications/Classification')

class ComponentInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = []
    }

    /// Instantiating

    open(props = {}) {
        return this.openOn(props)
    }

    openOn(props) {
        return this.new(props).yourself( (component) => {
            component.getMainComponent().open()

            return component
        })
    }
}

module.exports = Classification.define(ComponentInstantiator)