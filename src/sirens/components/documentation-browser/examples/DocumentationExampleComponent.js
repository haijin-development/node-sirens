const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')


class DocumentationExampleComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const example = flow.getValue()

        const exampleDescription = example.getDescription()

        componentsRenderer.render( function(component) {

            this.verticalStack( function() {

                this.label({
                    text: exampleDescription,
                    css: [ 'title-2', ],
                    wrapMode: 'wordChar',
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.verticalSeparator()

                this.component(
                    PlaygroundComponent.new({
                        id: 'playground',
                        text: "\n" + example.getCode() + "\n",
                        hasScrollBars: false,
                        viewAttributes: { stackSize: 'fixed' },
                    })
                )

            })

        })
    }
}

module.exports = Classification.define(DocumentationExampleComponent)
