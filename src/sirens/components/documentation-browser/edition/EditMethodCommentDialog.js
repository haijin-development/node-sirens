const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')
const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditMethodCommentDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building


    renderWith(componentsRenderer) {
        const method = this.getProps().method

        const methodName = method.getMethodName()

        const methodDeclaration = method.getSignatureString()

        const description = method.getMethodComment().getContents()

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Method ${methodDeclaration} description edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.method,
                            title:  `${methodDeclaration}`,
                            subtitle: `You are editing the description of the method ${methodName}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'methodDescription',
                            text: description,
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

        const methodNewComment = methodDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateMethodComment({
            methodNewComment: methodNewComment
        })
    }
}

module.exports = Classification.define(EditMethodCommentDialog)
