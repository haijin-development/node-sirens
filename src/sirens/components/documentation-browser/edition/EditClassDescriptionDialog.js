const Classification = require('../../../../O').Classification
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../../skins/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')
const EditDialogHeaderComponent = require('./EditDialogHeaderComponent')

class EditClassDescriptionDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const classDocumentation = this.getProps().classDocumentation

        const className = classDocumentation.getClassName()

        const description = classDocumentation.getDescription()

        const descriptionText = description.isNotBlank() ?
            description.getText()
            :
            'This class has no documentation yet.'

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Class ${className} description edition`,
                    width: 900,
                    height: 600,
                    window: component.getProps().window,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeaderComponent.new({
                            mainIcon: Resource.image.class,
                            title:  `${className}`,
                            subtitle: `You are editing the description of the class ${className}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.text({
                        id: 'classDescription',
                        text: descriptionText,
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
                label: 'Update class comment',
                action: () => { this.handleUpdateClassComment() },
            },
        ]

        this.assemble()

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateClassComment() {
        const classDescriptionComponent = this.getChildComponent({
            id: 'classDescription'
        })

        const classNewDescription = classDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateClassDescription({
            classNewDescription: classNewDescription
        })
    }
}

module.exports = Classification.define(EditClassDescriptionDialog)
