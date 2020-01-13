const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditReturnValueDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const methodDocumentation = this.getProps().methodDocumentation

        const returnValue = this.getProps().returnValue

        const returnValueDescription = returnValue.getDescription()

        if( returnValueDescription === undefined ) {
            returnValueDescription = ''
        }

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Returns edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {
                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.returnValue,
                            title:  `${methodDocumentation.getSignatureString()}`,
                            subtitle: `You are editing the return value of the method ${methodDocumentation.getMethodName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'returnsDescription',
                            text: returnValueDescription,
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
                action: () => { this.handleUpdateReturns() },
            },
        ]
    }

    /// Events

    handleUpdateReturns() {
        const returnsDescriptionComponent = this.getChildComponent({
            id: 'returnsDescription'
        })

        let returnValueDescription = returnsDescriptionComponent.getModel().getValue()

        if( returnValueDescription.trim() === '' ) {
            returnValueDescription = undefined
        }

        this.getProps().onUpdateReturnValue({
            returnValueDescription: returnValueDescription,
        })
    }
}

module.exports = Classification.define(EditReturnValueDialog)
