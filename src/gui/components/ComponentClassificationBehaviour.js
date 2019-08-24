const Classification = require('../../o-language/classifications/Classification')

/*
 * Temporary solution to add behaviour to classifications. 
 */
class ComponentClassificationBehaviour extends Classification {
    /// Instantiating

    static new(props = {}) {
        return OInstance.new().yourself( (object) => {
            object
                .behaveAs(this)
                .initialize(props)            
        })
    }

    static open(props = {}) {
        return this.openOn(props)
    }

    static openOn(props) {
        const component = this.new(props)

        if( component.isTopMostComponent() ) {
            component.getMainComponent().open()

            return component
        }

        const Window = require('./containers/Window')

        const window = Window.new()

        window.addComponent( component )

        window.open()

        return component
    }
}

module.exports = ComponentClassificationBehaviour