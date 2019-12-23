const Classification = require('../../../../O').Classification
const Component = require('../../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../../Skins').ComponentProtocol_Implementation
const GtkIcons = require('../../../../Skins').GtkIcons
const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')
const PlaygroundComponent = require ('../../shared/PlaygroundComponent')

class EditExampleDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const className = this.getProps().className

        const example = this.getProps().example

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Example edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.haiku,
                            title:  component.getProps().title,
                            subtitle: component.getProps().subtitle,
                        })
                    )

                    this.verticalSeparator()

                    this.verticalSplitter( function() {

                        this.text({
                            id: 'exampleDescription',
                            text: example.getDescription(),
                            viewAttributes: { splitProportion: 1.0/4.0 },
                        })

                        this.component(
                            PlaygroundComponent.new({
                                id: 'playground',
                                text: "\n" + example.getCode() + "\n",
                                hScroll: 'never',
                                vScroll: 'auto',
                                viewAttributes: {
                                    splitProportion: 3.0/4.0
                                },
                            })
                        )

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
                action: () => { this.handleUpdateExample() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateExample() {
        const exampleDescriptionComponent = this.getChildComponent({
            id: 'exampleDescription'
        })

        const exampleCodeComponent = this.getChildComponent({
            id: 'playground'
        })

        const description = exampleDescriptionComponent.getModel().getValue()
        const code = exampleCodeComponent.getText()

        this.getProps().onUpdateExample({ description: description, code: code })
    }
}

module.exports = Classification.define(EditExampleDialog)
