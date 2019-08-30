const Classification = require('../../o-language/classifications/Classification')

class ComponentClassification {
    /// Instantiating

    open(props = {}) {
        return this.openOn(props)
    }

    openOn(props) {
        return this.new(props).yourself( (component) => {

            if( component.isTopMostComponent() ) {
                component.getMainComponent().open()

                return component
            }

            const Window = require('./containers/Window')

            const window = Window.new()

            window.addComponent( component )

            window.open()

        })
    }
}

module.exports = Classification.define(ComponentClassification)