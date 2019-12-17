const path = require('path')
const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')

class ImplementationNoteDocumentation {
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
                            onClicked: component.getProps().editClosure,
                        })

                        this.textButton({
                            text: 'Delete',
                            image: {
                                filename: Resource.image.false,
                                width: 16,
                                height: 16,
                            },
                            onClicked: component.getProps().deleteClosure,                    
                        })

                    })

                }
            })

        })
    }
}

module.exports = Classification.define(ImplementationNoteDocumentation)
