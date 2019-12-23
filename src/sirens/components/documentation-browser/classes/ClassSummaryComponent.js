const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const GtkIcons = require('../../../../Skins').GtkIcons

class ClassSummaryComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const isInEditionMode = flow.isInEditionMode()

        const className = flow.getClassName()

        const description = flow.getClassDescription()

        const descriptionText = description.isNotBlank() ?
            description.getText()
            :
            'This class has no documentation yet.'

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {
                this.styles({
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({ viewAttributes: { stackSize: 'filled' } })

                this.label({
                    text: `${className} class`,
                    css: [ 'title-1', ],
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({ viewAttributes: { stackSize: 'filled' } })

                if( isInEditionMode ) {
                    this.textButton({
                        image: {
                            iconName: GtkIcons.edit,
                            size: GtkIcons.size._16x16,
                        },
                        viewAttributes: { stackSize: 'fixed' },
                        onClicked: () => {
                            flow.editClassDocumentationDescription({ parentWindow: this.getProps().window })
                        },
                    })
                }
            })

            this.component(
                PlaygroundComponent.new({
                    id: 'playground',
                    text: "\n" + descriptionText + "\n",
                    hasScrollBars: false,
                })
            )
        })

    }
}

module.exports = Classification.define(ClassSummaryComponent)
