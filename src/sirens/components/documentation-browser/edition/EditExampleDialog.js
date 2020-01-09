const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

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
                    buttons: component.getDialogButtons(),
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

                    this.spaceFiller( function() {
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

        })
    }

    getDialogButtons() {
        const icon = this.namespace().viewsNamespace().icons

        const acceptButtonLabel = this.getProps().acceptButtonLabel

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
                action: () => { this.handleUpdateExample() },
            },
        ]
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
