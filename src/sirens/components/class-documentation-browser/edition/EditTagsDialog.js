const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation
const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')

class EditTagsDialog {
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

        const tags = this.getProps().tags

        let tagsString = tags.join( ', ' )

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Tags edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.tag,
                            title:  `${className}.${method.getFunctionSignatureString()}`,
                            subtitle: `You are editing the tags of the method ${className}.${method.getMethodName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.label({
                        text: 'Tags list separated by a character ",".',
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                    this.verticalSeparator()

                    this.text({
                        id: 'tags',
                        text: tagsString,
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
                action: () => { this.handleUpdateTags() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateTags() {
        const tagsComponent = this.getChildComponent({
            id: 'tags'
        })

        let tagsString = tagsComponent.getModel().getValue()

        const newTags = tagsString.split( ',' )
            .sort()
            .map( (tag) => { return tag.trim() })

        this.getProps().onUpdateTags({
            newTags: newTags,
        })
    }
}

module.exports = Classification.define(EditTagsDialog)
