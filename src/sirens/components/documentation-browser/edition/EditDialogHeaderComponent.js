const Classification = require('../../../../O').Classification
const FilePath = require('../../../../O').FilePath
const Component = require('../../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../../skins/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../skins/gtk-views/constants/GtkIcons')

class EditDialogHeaderComponent {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const mainIcon = this.getProps().mainIcon
        const title = this.getProps().title
        const subtitle = this.getProps().subtitle

        const imageIsFile = FilePath.new({ path: mainIcon }).exists()

        componentsRenderer.render( function(component) {

            this.horizontalStack( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                if( imageIsFile ) {

                    this.image({
                        filename: mainIcon,
                        width: 48,
                        height: 48,
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                } else {

                    this.image({
                        iconName: mainIcon,
                        size: GtkIcons.size._48x48,
                        viewAttributes: {
                            stackSize: 'fixed',
                        },
                    })

                }

                this.image({
                    iconName: GtkIcons.edit,
                    size: GtkIcons.size._48x48,
                    marginLeft: 15,
                    viewAttributes: {
                        stackSize: 'fixed',
                    },
                })

                this.verticalStack( function() {

                    this.label({
                        text: title,
                    })

                    this.label({
                        text: subtitle,
                    })

                })

            })

        })

    }

}

module.exports = Classification.define(EditDialogHeaderComponent)
