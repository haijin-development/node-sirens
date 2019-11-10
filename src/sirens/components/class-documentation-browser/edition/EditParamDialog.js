const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')

class EditParamDialog {
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

        const method = this.getProps().method

        const param = this.getProps().param

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Parameter edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.param,
                            title:  `${className}.${method.getFunctionSignatureString()}`,
                            subtitle: `You are editing a parameter of the method ${className}.${method.getName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.verticalSplitter( function() {

                        this.container( function() {

                            this.text({
                                id: 'paramName',
                                text: param.Name,
                                viewAttributes: { splitProportion: 1.0/4.0 },
                            })

                        })

                        this.container( function() {

                            this.text({
                                id: 'paramDescription',
                                text: param.Description,
                                viewAttributes: { splitProportion: 3.0/4.0 },
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

        const param = {
            Name: paramNameComponent.getModel().getValue(),
            Description: paramDescriptionComponent.getModel().getValue(),
        }

        this.getProps().onUpdateParam({
            param: param,
        })
    }
}

module.exports = Classification.define(EditParamDialog)
