const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

class PlaygroundBrowserMenuBar {
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

                this.menuGroup({ label: 'File' }, function() {
                    this.item({
                        label: 'Open file...',
                        enabled: true,
                        action: component.getProps().openFile,
                    })

                    this.item({
                        label: 'Open file in new window...',
                        enabled: true,
                        action: component.getProps().openFileInNewWindow,
                    })

                    this.separator()

                    this.item({
                        label: 'Save file',
                        enabled: true,
                        action: component.getProps().saveFile,
                    })
                })

                this.menuGroup({ label: 'Browsers' }, function() {

                    this.item({
                        label: 'Open a class editor...',
                        enabled: true,
                        action: component.getProps().openClassEditor,
                    })

                    this.item({
                        label: 'Open another playground...',
                        enabled: true,
                        action: component.getProps().openPlayground,
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserMenuBar)
