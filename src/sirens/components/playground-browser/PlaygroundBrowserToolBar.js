const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

const GtkIcons = require('../../../Skins').GtkIcons
const Resource = require('../../objects/Resource')

class PlaygroundBrowserToolBar {
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
                    tooltip: 'Opens a file.',
                    action: component.getProps().openFile,
                    enabled: model.getChild({ id: 'openFile' }),
                })

                this.button({
                    label: 'Open file in new window...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a file in a new window.',
                    action: component.getProps().openFileInNewWindow,
                    enabled: model.getChild({ id: 'openFileInNewWindow' }),
                })

                this.separator()

                this.button({
                    label: 'Save file',
                    image: {
                        iconName: GtkIcons.save,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Saves the opened file.',
                    action: component.getProps().saveFile,
                    enabled: model.getChild({ id: 'saveFile' }),
                })

                this.separator()

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

module.exports = Classification.define(PlaygroundBrowserToolBar)
