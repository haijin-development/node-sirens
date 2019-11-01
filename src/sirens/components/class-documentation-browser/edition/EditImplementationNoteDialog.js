const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
const EditDialogHeader = require('./EditDialogHeader')

class EditImplementationNoteDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const className = model.getClassName()

        const implementationNoteText = this.getProps().implementationNoteText

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Implementation note edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: GtkIcons.dialogWarning,
                            title:  component.getProps().title,
                            subtitle: component.getProps().subtitle,
                        })
                    )

                    this.verticalSeparator()

                    this.text({
                        id: 'implementationNote',
                        text: implementationNoteText,
                        viewAttributes: {
                            stackSize: 'filled',
                        },
                    })

                })

            })

        })
    }

    open() {
        const acceptButtonLabel = this.getProps().acceptButtonLabel

        const dialogButtons = [
            {
                label: 'Cancel',
                image: {
                    iconName: GtkIcons.cancel,
                    size: GtkIcons.size._16x16,
                },
                action: () => {},
            },
            {
                image: {
                    iconName: GtkIcons.ok,
                    size: GtkIcons.size._16x16,
                },
                label: acceptButtonLabel,
                action: () => { this.handleUpdateImplementationNote() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateImplementationNote() {
        const implementationNoteComponent = this.getChildComponent({
            id: 'implementationNote'
        })

        const implementationNoteText = implementationNoteComponent.getModel().getValue()

        this.getProps().onUpdateImplementationNote({
            implementationNoteText: implementationNoteText
        })
    }
}

module.exports = Classification.define(EditImplementationNoteDialog)
