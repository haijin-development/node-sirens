const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

class SingleClassMenu {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const props = this.getProps()

        componentsRenderer.render(function (component) {

            this.horizontalStack( function () {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.toolBar( function() {

                    this.styles({
                        viewAttributes: {
                            stackSize: 'fixed',
                            stackAlign: 'end',
                        }
                    })

                    this.button({
                        label: 'Browse documentation',
                        image: {
                            iconName: GtkIcons.info,
                            size: GtkIcons.size._24x24,
                        },
                        tooltip: 'Opens a class documentation browser on the current selection.',
                        action: props.openDocumentationBrowser,
                    })
                })

            })

        })
    }
}

module.exports = Classification.define(SingleClassMenu)
