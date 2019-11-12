const Classification = require('../../../../O').Classification
const Component = require('../../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../../GUI').ComponentProtocol_Implementation

const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../GUI').GtkIcons

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

        const exampleDescription = this.getProps().exampleDescription

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
                            onClicked: component.handleEditExample.bind(component),                        
                        })

                        this.textButton({
                            text: 'Delete',
                            image: {
                                filename: Resource.image.false,
                                width: 16,
                                height: 16,
                            },
                            onClicked: component.handleDeleteExample.bind(component),                        
                        })

                    })
                }

            })

        })
    }

    /// Events

    handleEditExample() {
        const exampleIndex = this.getProps().index

        this.getProps().editExample({
            atIndex: exampleIndex
        })
    }

    handleDeleteExample() {
        const exampleIndex = this.getProps().index

        this.getProps().deleteExample({
            atIndex: exampleIndex
        })
    }

}

module.exports = Classification.define(ExampleHeader)
