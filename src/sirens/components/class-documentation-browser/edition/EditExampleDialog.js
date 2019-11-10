const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')
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
        const model = this.getModel()

        const className = model.getClassName()

        const example = this.getProps().example

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Example edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.haiku,
                            title:  component.getProps().title,
                            subtitle: component.getProps().subtitle,
                        })
                    )

                    this.verticalSeparator()

                    this.verticalSplitter( function() {

                        this.text({
                            id: 'exampleDescription',
                            text: example.Description,
                            viewAttributes: { splitProportion: 1.0/4.0 },
                        })

                        this.component(
                            PlaygroundComponent.new({
                                text: "\n" + example.Code + "\n",
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

        const example = {
            Description: exampleDescriptionComponent.getModel().getValue(),
            Code: exampleCodeComponent.getModel().getValue(),
        }

        this.getProps().onUpdateExample({
            example: example,
        })
    }
}

module.exports = Classification.define(EditExampleDialog)
