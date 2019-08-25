const Classification = require('../../o-language/classifications/Classification')

const ComponentClassification = Classification.define( class {
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
})

module.exports = ComponentClassification