const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../Skins').GtkIcons
const Resource = require('../../objects/Resource')

class FileEditorToolBar {
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
                    label: 'Open file...',
                    image: {
                        iconName: GtkIcons.open,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a file to edit its class.',
                    action: component.getProps().openFile,
                    enabled: model.getCommand({ id: 'openFile' }),
                })

                this.button({
                    label: 'Open file in new window...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a file in a new window to edit its class.',
                    action: component.getProps().openFileInNewWindow,
                    enabled: model.getCommand({ id: 'openFileInNewWindow' }),
                })

                this.separator()

                this.button({
                    label: 'Open documentation browser',
                    image: {
                        iconName: GtkIcons.info,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a class documentation browser on the selected class.',
                    action: component.getProps().openDocumentationBrowser,
                    enabled: model.getCommand({ id: 'openDocumentationBrowser' }),
                })

                this.separator()

                this.button({
                    label: 'Open another class editor',
                    image: {
                        filename: Resource.image.class,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens another class editor.',
                    action: component.getProps().openFileEditor,
                    enabled: model.getCommand({ id: 'openFileEditor' }),
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
                    enabled: model.getCommand({ id: 'openPlayground' }),
                })

            })

        })
    }
}

module.exports = Classification.define(FileEditorToolBar)
