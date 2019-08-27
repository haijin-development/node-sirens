const Classification = require('../../o-language/classifications/Classification')
const ContainerWidgetBuilder = require('./ContainerWidgetBuilder')

class ComponentRenderer {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootComponent']
        this.assumptions = [ContainerWidgetBuilder]
    }

    /// Accessing

    initialize({ rootComponent: rootComponent }) {
        this.previousClassificationDo( () => {
            this.initialize()
        })

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

module.exports = Classification.define(ComponentRenderer)