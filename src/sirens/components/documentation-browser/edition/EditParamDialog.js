const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation
const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditParamDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const methodDocumentation = this.getProps().methodDocumentation

        const param = this.getProps().param

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Parameter edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.param,
                            title:  `${methodDocumentation.getSignatureString()}`,
                            subtitle: `You are editing a parameter of the method ${methodDocumentation.getMethodName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.verticalSplitter( function() {

                        this.container({ viewAttributes: { splitProportion: 1.0/4.0 }}, function() {

                            this.text({
                                id: 'paramName',
                                text: param.getName(),
                            })

                        })

                        this.container({ viewAttributes: { splitProportion: 3.0/4.0 }}, function() {

                            this.text({
                                id: 'paramDescription',
                                text: param.getDescription(),
                            })

                        })

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
                action: () => { this.handleUpdateParam() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateParam() {
        const paramNameComponent = this.getChildComponent({
            id: 'paramName'
        })

        const paramDescriptionComponent = this.getChildComponent({
            id: 'paramDescription'
        })

        const name = paramNameComponent.getModel().getValue()
        const description = paramDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateParam({ name: name, description: description })
    }
}

module.exports = Classification.define(EditParamDialog)
