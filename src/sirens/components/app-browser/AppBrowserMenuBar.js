const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation

class AppBrowserMenuBar {
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

                this.menuGroup({ label: 'App' }, function() {
                    this.item({
                        label: 'Open folder...',
                        action: component.getProps().openFolder,
                        enabled: model.getCommand({ id: 'pickAndOpenFolder' }),
                    })

                })

                this.menuGroup({ label: 'Browsers' }, function() {

                    this.item({
                        label: 'Open class documentation browser',
                        action: component.getProps().openClassDocumentation,
                        enabled: model.getCommand({ id: 'openClassDocumentation' }),
                    })

                    this.item({
                        label: 'Open a class editor...',
                        action: component.getProps().openClassEditor,
                        enabled: model.getCommand({ id: 'openClassEditor' }),
                    })

                    this.item({
                        label: 'Open a playground...',
                        action: component.getProps().openPlayground,
                        enabled: model.getCommand({ id: 'openPlayground' }),
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(AppBrowserMenuBar)
