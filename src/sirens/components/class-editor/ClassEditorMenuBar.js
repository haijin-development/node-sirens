const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation


class ClassEditorMenuBar {
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
                        action: component.getProps().openFile,
                        enabled: model.getChild({ id: 'openFile' }),
                    })

                    this.item({
                        label: 'Open file in a new class browser...',
                        action: component.getProps().openFileInNewWindow,
                        enabled: model.getChild({ id: 'openFileInNewWindow' }),
                    })
                })

                this.menuGroup({ label: 'Browsers' }, function() {
                    this.item({
                        label: 'Open another class editor...',
                        action: component.getProps().openClassEditor,
                        enabled: model.getChild({ id: 'openClassEditor' }),
                    })

                    this.item({
                        label: 'Open a playground...',
                        action: component.getProps().openPlayground,
                        enabled: model.getChild({ id: 'openPlayground' }),
                    })

                })

                this.menuGroup({ label: 'Documentation' }, function() {
                    this.item({
                        label: 'Open a documentation browser...',
                        action: component.getProps().openDocumentationBrowser,
                        enabled: model.getChild({ id: 'openDocumentationBrowser' }),
                    })

                })
            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
