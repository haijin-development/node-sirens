const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const TagsDocumentationComponent = require('../tags/TagsDocumentationComponent')

class MethodSummaryComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        const methodSignature = flow.getMethodSignature()

        const description = flow.getMethodDescription()

        const summaryText = description.isNotBlank() ?
            description.getText()
            :
            'This method has no documentation yet.'

        const isInEditionMode = flow.isInEditionMode()

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {
                this.spaceFiller()

                this.label({
                    text: methodSignature,
                    css: [ 'title-1', ],
                    editable: false,
                })

                this.spaceFiller()

                if( isInEditionMode ) {
                    this.textButton({
                        image: {
                            iconName: icon.edit,
                            size: icon.size._16x16,
                        },
                        onClicked: () => {
                            flow.editMethodDocumentationDescription({
                                parentWindow: component.getProps().window
                            })
                        },
                    })
                }

            })

            this.component(
                PlaygroundComponent.new({
                    id: 'playground',
                    text: "\n" + summaryText + "\n",
                    hasScrollBars: false,
                })
            )

            this.component(
                TagsDocumentationComponent.new({
                    model: flow,
                    id: 'tags',
                    tags: flow.getTagsSortedByPriority(),
                    window: component.getProps().window,
                })
            )
        })

    }
}

module.exports = Classification.define(MethodSummaryComponent)
