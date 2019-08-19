const OInstance = require('../../o-language/classifications/OInstance')
const ContainerWidgetBuilder = require('./ContainerWidgetBuilder')

class ComponentRenderer {
    /// Instantiating

    static onRootComponent(rootComponent) {
        return OInstance.new().yourself( (object) => {
                    object
                        .behaveAs(this)
                        .initialize(rootComponent)
                })
    }

    /// Definition

    static definition() {
        this.instanceVariables = ['rootComponent']
        this.assumptions = [ContainerWidgetBuilder]
    }

    /// Accessing

    initialize(rootComponent) {
        this.rootComponent = rootComponent
    }


    /// Building

    render(closure) {
        this.build(closure, this.rootComponent)

        const childComponents = this.getChildComponents()

        this.rootComponent.addAllComponents( childComponents )

        return this.rootComponent
    }
}

module.exports = ComponentRenderer