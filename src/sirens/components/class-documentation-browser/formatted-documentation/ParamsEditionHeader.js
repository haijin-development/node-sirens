const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')

class ParamsEditionHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: { stackSize: 'fixed' },
                })

                this.image({
                    filename: Resource.image.param,
                    width: 16,
                    height: 16,
                    viewAttributes: { stackSize: 'fixed' },
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: { stackSize: 'filled' },
                })

                this.textButton({
                    text: 'Add a new Parameter ...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._16x16,
                    },
                    viewAttributes: { stackSize: 'fixed' },
                    onClicked: () => {
                        flow.createMethodDocumentationParam({
                            parentWindow: component.getProps().window,
                        })
                    },
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: { stackSize: 'filled' },
                })

            })

        })
    }
}

module.exports = Classification.define(ParamsEditionHeader)
