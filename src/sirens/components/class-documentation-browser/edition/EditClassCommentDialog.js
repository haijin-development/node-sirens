const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')

const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../../objects/Resource')
const EditDialogHeader = require('./EditDialogHeader')

class EditClassCommentDialog {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    getClassDescription() {
        const model = this.getModel()

        if( this.getProps().unformatted === true ) {

            return model.getClassUnformattedComment()

        } else {

            const documentation = model.getClassDocumentation()

            let description = documentation.getDescription()

            if( description.trim() === '' ) {
                description = 'This class has no documentation yet.'
            }

            return description
        }
    }

    renderWith(componentsRenderer) {
        const model = this.getModel()

        const className = model.getClassName()

        const description = this.getClassDescription()

        componentsRenderer.render( function(component) {

            this.dialog( function() {

                this.styles({
                    title: `Class ${className} description edition`,
                    width: 900,
                    height: 600,
                })

                this.verticalStack( function() {

                    this.component(
                        EditDialogHeader.new({
                            mainIcon: Resource.image.class,
                            title:  `${className}`,
                            subtitle: `You are editing the description of the class ${className}.`,
                        })
                    )

                    this.verticalSeparator()

                    this.text({
                        id: 'classDescription',
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
                label: 'Update class comment',
                action: () => { this.handleUpdateClassComment() },
            },
        ]

        const dialog = this.getMainComponent()

        dialog.setButtons( dialogButtons )

        return dialog.open()
    }

    /// Events

    handleUpdateClassComment() {
        const classDescriptionComponent = this.getChildComponent({
            id: 'classDescription'
        })

        const newClassDescription = classDescriptionComponent.getModel().getValue()

        this.getProps().onUpdateClassComment({
            newClassDescription: newClassDescription
        })
    }
}

module.exports = Classification.define(EditClassCommentDialog)
