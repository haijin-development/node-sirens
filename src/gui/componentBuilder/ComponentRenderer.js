const Classification = require('../../o-language/classifications/Classification')
const ContainerWidgetBuilder = require('./ContainerWidgetBuilder')
const ComponentRendererProtocol = require('../protocols/ComponentRendererProtocol')

class ComponentRenderer {
    /// Definition

    static definition() {
        this.instanceVariables = ['rootComponent']
        this.assumes = [ContainerWidgetBuilder]
        this.implements = [ComponentRendererProtocol]
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

        this.rootComponent.addAllChildrenComponents( childComponents )

        return this.rootComponent
    }
}

module.exports = Classification.define(ComponentRenderer)