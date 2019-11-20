const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../Skins').GtkIcons
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

                this.button({
                    label: 'Reload documentation.',
                    image: {
                        iconName: GtkIcons.refresh,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Realoads the original documentation.',
                    action: component.getProps().reloadClassDefinition,
                    enabled: model.getChild({ id: 'reloadClassDefinition' }),
                })

                this.separator()

                this.toggleButton({
                    model: model.getChild({ id: 'showsUnformattedComments' }),
                    label: 'Show unformatted comment.',
                    image: {
                        iconName: GtkIcons.revertToSave,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Shows the unformatted comment as it appears in the file.',
                })

                this.toggleButton({
                    model: model.getChild({ id: 'isEditingDocumentation' }),
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
                    enabled: model.getChild({ id: 'openClassDocumentation' }),
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
                    enabled: model.getChild({ id: 'openClassEditor' }),
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
                    enabled: model.getChild({ id: 'openPlayground' }),
                })

            })

        })
    }
}

module.exports = Classification.define(ClassDocumentationToolBar)
