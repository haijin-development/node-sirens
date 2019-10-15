const path = require('path')
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')

class ImplementationNoteDocumentation {
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

        const index = this.getProps().index + 1
        const implementationNote = this.getProps().implementationNote

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    marginVertical: 10,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.verticalStack( function() {

                    this.horizontalStack( function() {

                        this.image({
                            iconName: GtkIcons.dialogWarning,
                            size: GtkIcons.size._32x32,
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })

                        this.label({
                            text: `Implementation note # ${index}`,
                        })

                    })

                    this.horizontalStack( function() {

                        this.label({
                            text: implementationNote,
                            viewAttributes: {
                                stackSize: 'fixed',
                            },
                        })

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
                            onClicked: component.handleEditImplementationNote.bind(component),                        
                        })

                        this.textButton({
                            text: 'Delete',
                            image: {
                                filename: Resource.image.false,
                                width: 16,
                                height: 16,
                            },
                            onClicked: component.handleDeleteImplementationNote.bind(component),                        
                        })

                    })

                }
            })

        })
    }

    /// Events

    handleEditImplementationNote() {
        const implementationNodeIndex = this.getProps().index

        this.getProps().editImplementationNote({
            atIndex: implementationNodeIndex
        })
    }

    handleDeleteImplementationNote() {
        const implementationNodeIndex = this.getProps().index

        this.getProps().deleteImplementationNote({
            atIndex: implementationNodeIndex
        })
    }
}

module.exports = Classification.define(ImplementationNoteDocumentation)
