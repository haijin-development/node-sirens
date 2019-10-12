const fs = require('fs')
const Classification = require('../../../../../src/o-language/classifications/Classification')
const Component = require('../../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../../gui/protocols/ComponentProtocol_Implementation')
const GtkIcons = require('../../../../gui/gtk-views/constants/GtkIcons')

class EditDialogHeader {
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

        const imageIsFile = fs.existsSync( mainIcon )

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

module.exports = Classification.define(EditDialogHeader)
