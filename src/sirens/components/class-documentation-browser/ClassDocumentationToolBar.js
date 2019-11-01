const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../objects/Resource')

class ClassDocumentationToolBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
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
                    label: 'Show unformatted comment.',
                    image: {
                        iconName: GtkIcons.revertToSave,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Shows the unformatted comment as it appears in the file.',
                })

                this.button({
                    label: 'Reload documentation.',
                    image: {
                        iconName: GtkIcons.refresh,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Realoads the original documentation.',
                    action: () => { model.reload() },
                })

                this.separator()

                this.toggleButton({
                    model: model.getEditionModeModel(),
                    label: 'Edition mode.',
                    image: {
                        iconName: GtkIcons.edit,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Turn it on to edit the documentation.',
                })

                this.separator()

                this.button({
                    label: 'Open a new class documentation browser',
                    image: {
                        iconName: GtkIcons.info,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a new class documentation browser.',
                    action: component.getProps().openClassDocumentation,
                })

                this.button({
                    label: 'Open class editor',
                    image: {
                        filename: Resource.image.class,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a class editor.',
                    action: component.getProps().openClassEditor,
                })

                this.button({
                    label: 'Open playground',
                    image: {
                        filename: Resource.image.haiku,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a playground.',
                    action: component.getProps().openPlayground,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassDocumentationToolBar)
