const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation
const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')

class EditReturnsDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        const method = this.getProps().method

        let returns = this.getProps().returns

        if( returns === undefined ) {
            returns = {
                Description: ''
            }
        }

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Returns edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.returns,
                            title:  `${className}.${method.getFunctionSignatureString()}`,
                            subtitle: `You are editing the return value of the method ${className}.${method.getName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.text({
                        id: 'returnsDescription',
                        text: returns.Description,
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
                action: () => { this.handleUpdateReturns() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateReturns() {
        const returnsDescriptionComponent = this.getChildComponent({
            id: 'returnsDescription'
        })

        let returns = {
            Description: returnsDescriptionComponent.getModel().getValue()
        }

        if( returns.Description.trim() === '' ) {
            returns = undefined
        }

        this.getProps().onUpdateReturns({
            returns: returns,
        })
    }
}

module.exports = Classification.define(EditReturnsDialog)
