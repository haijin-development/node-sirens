const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const PlaygroundComponent = require ('../../shared/PlaygroundComponent')
const TagsDocumentationComponent = require('../tags/TagsDocumentationComponent')
const GtkIcons = require('../../../../Skins').GtkIcons

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

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {
                this.styles({
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.label({ viewAttributes: { stackSize: 'filled' } })

                this.label({
                    text: methodSignature,
                    css: [ 'title-1', ],
                    editable: false,
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
                            flow.editMethodDocumentationDescription({ parentWindow: this.getProps().window })
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
                    tags: flow.getTagsSortedByPriority()
                })
            )
        })

    }
}

module.exports = Classification.define(MethodSummaryComponent)
