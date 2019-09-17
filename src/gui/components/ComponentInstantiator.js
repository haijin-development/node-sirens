const Classification = require('../../o-language/classifications/Classification')

/*
    classification(`
        This classification adds to the Component classification the protocol to instantiate its instances
        and open them in a container Window.
    `)

    example(
        description: `
            Define a component and open it.
        `,
        code: `
            class CustomComponent {
                /// Definition

                static definition() {
                    this.instanceVariables = []
                    this.assumes = [Component]
                    this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
                    this.classificationBehaviours = [ComponentInstantiator]
                }

                /// Building

                renderWith(componentsRenderer) {
                    componentsRenderer.render(function (component) {
                        this.window( function() {
                            this.styles({
                                width: 100,
                                height: 100,
                            })

                            this.checkBox({ label: 'A checkbox' })
                        })
                    })
                }

            }

            CustomComponent = Classification.define(CustomComponent)

            CustomComponent.open()        
        `
    )
 */
class ComponentInstantiator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = []
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

    render(closure) {
        const ComponentRenderer = require('../componentBuilder/ComponentRenderer')

        const componentsRenderer = ComponentRenderer.new({ rootComponent: null })

        componentsRenderer.build(closure, componentsRenderer)

        const childComponents = componentsRenderer.getChildComponents()

        return childComponents[0]
    }
}

module.exports = Classification.define(ComponentInstantiator)