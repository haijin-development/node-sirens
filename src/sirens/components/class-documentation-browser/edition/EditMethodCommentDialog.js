const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation
const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')

class EditMethodCommentDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    getMethodDescription() {
        const method = this.getProps().method

        if( this.getProps().unformatted === true ) {

            return method.getMethodComment().getContents()

        } else {

            const documentation = method.getDocumentation()

            let description = documentation.getDescription()

            if( description.trim() === '' ) {
                description = 'This method has no documentation yet.'
            }

            return description
        }
    }

    renderWith(componentsRenderer) {
        const method = this.getProps().method

        const className = this.getProps().className

        const methodName = method.getMethodName()

        const methodDeclaration = method.getFunctionSignatureString()

        const description = this.getMethodDescription()

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Method ${methodDeclaration} description edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.method,
                            title:  `${methodDeclaration}`,
                            subtitle: `You are editing the description of the method ${className}.${methodName}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.text({
                        id: 'methodDescription',
                        text: description,
                        viewAttributes: {
                            stackSize: 'filled',
                        },
                    })

                })

            })

        })
    }

    open() {
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
                label: 'Update method description',
                action: () => { this.handleUpdateClassComment() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
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

module.exports = Classification.define(EditMethodCommentDialog)
