const OInstance = require('../../o-language/classifications/OInstance')
const GenericComponentBuilder = require('./GenericComponentBuilder')

class ComponentRenderer {
    /// Instantiating

    static onRootComponent(rootComponent) {
        return OInstance.new().yourself( (object) => {
                    object
                        .behaveAs(this)
                        .setRootComponent(rootComponent)
                })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['rootComponent']
    }

    /// Accessing

    setRootComponent(rootComponent) {
        this.rootComponent = rootComponent
    }


    /// Building

    render(closure) {
        const builder = GenericComponentBuilder.new().yourself( (builder) => {
            builder.build(closure, this.rootComponent)
        })

        const props = builder.getProps()
        const childComponents = builder.getChildComponents()

        this.rootComponent.addAllComponents( childComponents )

        return this.rootComponent
    }
}

module.exports = ComponentRenderer