const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')

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

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.spaceFiller()

                this.label({
                    text: `${className} class`,
                    css: [ 'title-1', ],
                })

                this.spaceFiller()

                if( isInEditionMode ) {
                    this.textButton({
                        image: {
                            iconName: icon.edit,
                            size: icon.size._16x16,
                        },
                        onClicked: () => {
                            flow.editClassDocumentationDescription({
                                parentWindow: component.getProps().window
                            })
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
