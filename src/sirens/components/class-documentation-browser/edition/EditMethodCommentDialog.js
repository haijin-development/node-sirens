const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
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

            return method.getComment().getSourceCode()

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
        const model = this.getModel()

        const method = this.getProps().method

        const classdName = model.getClassName()
        const methodName = method.getName()

        const methodDeclaration = method.getFunctionSignatureString()

        const description = this.getMethodDescription()

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Method ${methodDeclaration} description edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.method,
                            title:  `${methodDeclaration}`,
                            subtitle: `You are editing the description of the method ${classdName}.${methodName}.`,
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
