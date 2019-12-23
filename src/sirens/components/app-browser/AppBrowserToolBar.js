const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../Skins').GtkIcons
const Resource = require('../../objects/Resource')

class AppBrowserToolBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const flow = this.getModel()

        componentsRenderer.render(function (component) {

            this.toolBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.button({
                    label: 'Open folder...',
                    image: {
                        iconName: GtkIcons.open,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens an app folder.',
                    action: component.getProps().openFolder,
                    enabled: flow.getCommand({ id: 'pickAndOpenFolder' }),
                })

                this.separator()

                this.button({
                    label: 'Open playground',
                    image: {
                        filename: Resource.image.haiku,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a playground.',
                    action: component.getProps().openPlayground,
                    enabled: flow.getCommand({ id: 'openPlayground' }),
                })

                this.separator()

                this.toggleButton({
                    model: flow.getFlowPoint({ id: 'browsingMode.showsUnformattedComments' }),
                    label: 'Show unformatted comment.',
                    image: {
                        iconName: GtkIcons.revertToSave,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Shows the unformatted comment as it appears in the file.',
                })

                this.toggleButton({
                    model: flow.getFlowPoint({ id: 'browsingMode.isEditingDocumentation' }),
                    label: 'Edition mode.',
                    image: {
                        iconName: GtkIcons.edit,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Turn it on to edit the documentation.',
                })

            })

        })
    }
}

module.exports = Classification.define(AppBrowserToolBar)
