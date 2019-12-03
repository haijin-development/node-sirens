const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../Skins').GtkIcons

class ExampleHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const isInEditionMode = model.isInEditionMode()

        const exampleNumber = this.getProps().index + 1

        const example = this.getProps().example

        const exampleDescription = example.Description

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.image({
                    filename: Resource.image.haiku,
                    width: 48,
                    height: 48,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.verticalStack( function() {
                    this.label({
                        text: `Example # ${exampleNumber}`,
                    })

                    this.label({
                        text: exampleDescription,
                    })
                })

                if( isInEditionMode ) {

                    this.verticalStack( function() {

                        this.styles({
                            viewAttributes: {
                                stackSize: 'fixed',
                                stackAlign: 'end',
                            },
                        })

                        this.textButton({
                            text: 'Edit...',
                            image: {
                                iconName: GtkIcons.edit,
                                size: GtkIcons.size._16x16,
                            },
                            onClicked: component.getProps().editClosure,
                            viewAttributes: { stackSize: 'fixed' },
                        })

                        this.textButton({
                            text: 'Delete',
                            image: {
                                filename: Resource.image.false,
                                width: 16,
                                height: 16,
                            },
                            onClicked: component.getProps().deleteClosure,
                            viewAttributes: { stackSize: 'fixed' },
                        })

                    })
                }

            })

        })
    }
}

module.exports = Classification.define(ExampleHeader)
