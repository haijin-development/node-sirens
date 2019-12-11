const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation


class FileEditorMenuBar {
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

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.menuGroup({ label: 'File' }, function() {
                    this.item({
                        label: 'Open file...',
                        action: component.getProps().openFile,
                        enabled: flow.getCommand({ id: 'openFile' }),
                    })

                    this.item({
                        label: 'Open file in a new class browser...',
                        action: component.getProps().openFileInNewWindow,
                        enabled: flow.getCommand({ id: 'openFileInNewWindow' }),
                    })
                })

                this.menuGroup({ label: 'Browsers' }, function() {
                    this.item({
                        label: 'Open another class editor...',
                        action: component.getProps().openFileEditor,
                        enabled: flow.getCommand({ id: 'openFileEditor' }),
                    })

                    this.item({
                        label: 'Open a playground...',
                        action: component.getProps().openPlayground,
                        enabled: flow.getCommand({ id: 'openPlayground' }),
                    })

                })

                this.menuGroup({ label: 'Documentation' }, function() {
                    this.item({
                        label: 'Open a documentation browser...',
                        action: component.getProps().openDocumentationBrowser,
                        enabled: flow.getCommand({ id: 'openDocumentationBrowser' }),
                    })

                })
            })

        })
    }
}

module.exports = Classification.define(FileEditorMenuBar)
