const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation

const GtkIcons = require('../../../GUI').GtkIcons
const Resource = require('../../objects/Resource')

class EditMethodDescriptionHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.method,
                    width: 16,
                    height: 16,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })

                this.textButton({
                    text: 'Edit method description ...',
                    image: {
                        iconName: GtkIcons.edit,
                        size: GtkIcons.size._16x16,
                    },
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                    onClicked: component.getProps().editionClosure,
                })

                // To center the button horizontally
                this.label({
                    viewAttributes: {
                        stackSize: 'filled',
                    },
                })
            })

        })
    }
}

module.exports = Classification.define(EditMethodDescriptionHeader)
