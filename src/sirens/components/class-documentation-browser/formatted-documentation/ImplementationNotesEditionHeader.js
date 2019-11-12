const Classification = require('../../../../O').Classification
const Component = require('../../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../../GUI').ComponentProtocol_Implementation

const GtkIcons = require('../../../../GUI').GtkIcons

class ImplementationNotesEditionHeader {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Actions


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
                    iconName: GtkIcons.dialogWarning,
                    size: GtkIcons.size._16x16,
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
                    text: 'Add a new Implementation note ...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._16x16,
                    },
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                    onClicked: component.handleAddNewImplementationNote.bind(component),
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

    handleAddNewImplementationNote() {
        this.getProps().addNewImplementationNote()
    }
}

module.exports = Classification.define(ImplementationNotesEditionHeader)
