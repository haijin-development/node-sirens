const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditMethodDescriptionDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const methodDocumentation = this.getProps().methodDocumentation

        const description = methodDocumentation.getDescription()

        const descriptionText = description.isNotBlank() ?
            description.getText()
            :
            'This class has no documentation yet.'

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Method ${methodDocumentation.getSignatureString()} description edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.method,
                            title:  `${methodDocumentation.getSignatureString()}`,
                            subtitle: `You are editing the description of the method ${methodDocumentation.getMethodName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'methodDescription',
                            text: descriptionText,
                        })
                    })
                })

            })

        })
    }

    getDialogButtons() {
        const icon = this.namespace().viewsNamespace().icons

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
                label: 'Update method description',
                action: () => { this.handleUpdateClassComment() },
            },
        ]
    }

    /// Events

    handleUpdateClassComment() {
        const methodDescriptionComponent = this.getChildComponent({
            id: 'methodDescription'
        })

        const methodNewDescription = methodDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateMethodComment({
            methodNewDescription: methodNewDescription
        })
    }
}

module.exports = Classification.define(EditMethodDescriptionDialog)
