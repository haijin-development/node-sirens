const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditClassCommentDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        const description = this.getProps().classComment

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Class ${className} description edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.class,
                            title:  `${className}`,
                            subtitle: `You are editing the comment of the class ${className}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'classDescription',
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
                label: 'Update class comment',
                action: () => { this.handleUpdateClassComment() },
            },
        ]
    }

    /// Events

    handleUpdateClassComment() {
        const classDescriptionComponent = this.getChildComponent({
            id: 'classDescription'
        })

        const classNewComment = classDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateClassComment({
            classNewComment: classNewComment
        })
    }
}

module.exports = Classification.define(EditClassCommentDialog)
