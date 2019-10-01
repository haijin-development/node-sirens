const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/GtkIcons')

class SingleClassMenu {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const props = this.getProps()

        componentsRenderer.render(function (component) {

            this.toolBar( function() {

                this.styles({
                    viewCustomAttributes: {
                        packExpand: false,
                    }
                })

                this.item({
                    label: 'Browse documentation',
                    icon: GtkIcons.info,
                    tooltip: 'Opens a DocumentationBrowser on the current selection.',
                    action: props.openDocumentationBrowser,
                })
            })

        })
    }
}

module.exports = Classification.define(SingleClassMenu)
