const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

class AppBrowserMenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
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
                        enabled: true,
                        action: component.getProps().openFolder,
                    })

                })

                this.menuGroup({ label: 'Browsers' }, function() {

                    this.item({
                        label: 'Open a class editor...',
                        enabled: true,
                        action: component.getProps().openClassEditor,
                    })

                    this.item({
                        label: 'Open a playground...',
                        enabled: true,
                        action: component.getProps().openPlayground,
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(AppBrowserMenuBar)
