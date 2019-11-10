const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
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
        const model = this.getModel()

        const className = model.getClassName()

        const method = this.getProps().method

        const tags = this.getProps().tags

        let tagsString = tags.join( ', ' )

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Tags edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.tag,
                            title:  `${className}.${method.getFunctionSignatureString()}`,
                            subtitle: `You are editing the tags of the method ${className}.${method.getName()}.`,
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
