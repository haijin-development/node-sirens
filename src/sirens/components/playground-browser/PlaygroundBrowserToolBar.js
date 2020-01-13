const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

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
        const flow = this.getModel()

        const icon = this.namespace().viewsNamespace().icons

        componentsRenderer.render(function (component) {

            this.toolBar( function() {

                this.button({
                    label: 'Open file...',
                    image: {
                        iconName: icon.open,
                        size: icon.size._24x24,
                    },
                    tooltip: 'Opens a file.',
                    action: component.getProps().openFile,
                    enabled: flow.getCommand({ id: 'openFile' }),
                })

                this.button({
                    label: 'Open file in new window...',
                    image: {
                        iconName: icon.add,
                        size: icon.size._24x24,
                    },
                    tooltip: 'Opens a file in a new window.',
                    action: component.getProps().openFileInNewWindow,
                    enabled: flow.getCommand({ id: 'openFileInNewWindow' }),
                })

                this.separator()

                this.button({
                    label: 'Save file',
                    image: {
                        iconName: icon.save,
                        size: icon.size._24x24,
                    },
                    tooltip: 'Saves the opened file.',
                    action: component.getProps().saveFile,
                    enabled: flow.getCommand({ id: 'saveFile' }),
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

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserToolBar)
