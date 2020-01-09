const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')
const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditTagsDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const methodDocumentation = this.getProps().methodDocumentation

        const tags = this.getProps().tags.map( (tag) => {
            return tag.getLabel()
        })

        let tagsString = tags.join( ', ' )

        componentsRenderer.render( function(component) {

            this.dialog( function() {
                this.styles({
                    title: `Tags edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                    buttons: component.getDialogButtons(),
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.tag,
                            title:  `${methodDocumentation.getSignatureString()}`,
                            subtitle: `You are editing the tags of the method ${methodDocumentation.getMethodName()}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.label({
                        text: 'Tags list separated by a character ",".',
                    })

                    this.verticalSeparator()

                    this.spaceFiller( function() {
                        this.text({
                            id: 'tags',
                            text: tagsString,
                        })

                    })
                })
            })

        })
    }

    getDialogButtons() {
        const acceptButtonLabel = this.getProps().acceptButtonLabel

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
                label: acceptButtonLabel,
                action: () => { this.handleUpdateTags() },
            },
        ]
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
