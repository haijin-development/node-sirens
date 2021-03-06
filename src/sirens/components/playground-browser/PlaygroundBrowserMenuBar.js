const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

class PlaygroundBrowserMenuBar {
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

            this.menuBar( function() {

                this.menuGroup({ label: 'File' }, function() {
                    this.item({
                        label: 'Open file...',
                        enabled: flow.getCommand({ id: 'openFile' }),
                        action: component.getProps().openFile,
                    })

                    this.item({
                        label: 'Open file in new window...',
                        enabled: flow.getCommand({ id: 'openFileInNewWindow' }),
                        action: component.getProps().openFileInNewWindow,
                    })

                    this.separator()

                    this.item({
                        label: 'Save file',
                        enabled: flow.getCommand({ id: 'saveFile' }),
                        action: component.getProps().saveFile,
                    })

                })

                this.menuGroup({ label: 'Browsers' }, function() {

                    this.item({
                        label: 'Open another playground...',
                        enabled: flow.getCommand({ id: 'openPlayground' }),
                        action: component.getProps().openPlayground,
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserMenuBar)
