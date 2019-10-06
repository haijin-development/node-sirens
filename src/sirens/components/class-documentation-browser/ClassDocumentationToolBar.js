const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

class ClassDocumentationToolBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render(function (component) {

            this.toolBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.toggleButton({
                    model: model.getShowUnformattedCommentsModel(),
                    label: 'Show unformatted comment',
                    icon: GtkIcons.revertToSave,
                    tooltip: 'Shows the unformatted comment as it appears in the file.',
                })

                this.item({
                    label: 'Reload documentation.',
                    icon: GtkIcons.refresh,
                    tooltip: 'Realoads the original documentation.',
                    action: () => { model.reload() },
                })

            })

        })
    }
}

module.exports = Classification.define(ClassDocumentationToolBar)
