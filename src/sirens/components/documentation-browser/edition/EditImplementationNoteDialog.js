const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditImplementationNoteDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        const implementationNoteText = this.getProps().implementationNoteText

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Implementation note edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: icon.dialogWarning,
                            title:  component.getProps().title,
                            subtitle: component.getProps().subtitle,
                        })
                    )

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'implementationNote',
                            text: implementationNoteText,
                        })
                    })
                })

            })

        })
    }

    getDialogButtons() {
        const icon = this.namespace().viewsNamespace().icons

        const acceptButtonLabel = this.getProps().acceptButtonLabel

        return [
            {
                label: 'Cancel',
                image: {
                    iconName: icon.cancel,
                    size: icon.size._16x16,
                },
                action: () => {},
            },
            {
                image: {
                    iconName: icon.ok,
                    size: icon.size._16x16,
                },
                label: acceptButtonLabel,
                action: () => { this.handleUpdateImplementationNote() },
            },
        ]
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
