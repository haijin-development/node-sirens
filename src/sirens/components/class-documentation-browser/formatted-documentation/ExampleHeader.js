const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const Resource = require('../../../objects/Resource')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')

class ExampleHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
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
