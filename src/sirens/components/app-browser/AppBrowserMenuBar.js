const Classification = require('../../../O').Classification
const Component = require('../../../skins/components/Component')
const ComponentProtocol_Implementation = require('../../../skins/protocols/ComponentProtocol_Implementation')

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
