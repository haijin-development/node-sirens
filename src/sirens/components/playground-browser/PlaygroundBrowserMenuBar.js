const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class PlaygroundBrowserMenuBar {
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

            this.menuBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.menuGroup({ label: 'File' }, function() {
                    this.item({
                        label: 'Open file...',
                        enabled: model.getChild({ id: 'openFile' }),
                        action: component.getProps().openFile,
                    })

                    this.item({
                        label: 'Open file in new window...',
                        enabled: model.getChild({ id: 'openFileInNewWindow' }),
                        action: component.getProps().openFileInNewWindow,
                    })

                    this.separator()

                    this.item({
                        label: 'Save file',
                        enabled: model.getChild({ id: 'saveFile' }),
                        action: component.getProps().saveFile,
                    })
                })

                this.menuGroup({ label: 'Browsers' }, function() {

                    this.item({
                        label: 'Open a class editor...',
                        enabled: model.getChild({ id: 'openClassEditor' }),
                        action: component.getProps().openClassEditor,
                    })

                    this.item({
                        label: 'Open another playground...',
                        enabled: model.getChild({ id: 'openPlayground' }),
                        action: component.getProps().openPlayground,
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserMenuBar)
