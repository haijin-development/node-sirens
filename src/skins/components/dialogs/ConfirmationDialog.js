const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

class ConfirmationDialog {
    /// Definition

    static definition() {
        this.instanceVariables = ['confirmationAnswer']
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const title = this.getProps().title ?
            this.getProps().title
            :
            'Please confirm ...'

        const confirmationText = this.getProps().confirmationText

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: title,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                    css: ['confirmation-dialog-component']
                })

                this.verticalStack( function() {

                    this.styles({
                        css: ['dialog-component-body'],
                    })

                    this.label({
                        text: confirmationText,
                    })

                })

            })

        })
    }

    setConfirmationAnswer(value) {
        this.confirmationAnswer = value
    }

    getConfirmationAnswer() {
        return this.confirmationAnswer
    }

    getDialogButtons() {
        const icon = this.namespace().viewsNamespace().icons

        const confirmLabel = this.getProps().confirmLabel ?
            this.getProps().confirmLabel : 'Yes'

        const rejectLabel = this.getProps().rejectLabel ?
            this.getProps().rejectLabel : 'No'

        return [
            {
                label: rejectLabel,
                image: {
                    iconName: icon.cancel,
                    size: icon.size._16x16,
                },
                action: () => { this.setConfirmationAnswer(false) },
            },
            {
                label: confirmLabel,
                image: {
                    iconName: icon.ok,
                    size: icon.size._16x16,
                },
                action: () => { this.setConfirmationAnswer(true) },
            },
        ]
    }

    open() {
        this.previousClassificationDo( () => {
            this.open()
        })

        return this.getConfirmationAnswer()
    }
}

module.exports = Classification.define(ConfirmationDialog)
