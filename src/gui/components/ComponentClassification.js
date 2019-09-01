const Classification = require('../../o-language/classifications/Classification')

class ComponentClassification {
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

module.exports = Classification.define(ComponentClassification)