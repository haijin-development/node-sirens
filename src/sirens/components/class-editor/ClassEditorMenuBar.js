const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation


class ClassEditorMenuBar {
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
                        label: 'Open file in a new class browser...',
                        enabled: true,
                        action: component.getProps().openFileInNewWindow,
                    })

                    this.skip().separator()

                    this.skip().item({
                        label: 'Save file',
                        enabled: true,
                        action: component.getProps().saveFile,
                    })
                })

                this.menuGroup({ label: 'Browsers' }, function() {
                    this.item({
                        label: 'Open another class editor...',
                        enabled: true,
                        action: component.getProps().openClassEditor,
                    })

                    this.item({
                        label: 'Open a playground...',
                        enabled: true,
                        action: component.getProps().openPlayground,
                    })

                })

                this.menuGroup({ label: 'Documentation' }, function() {
                    this.item({
                        label: 'Open a documentation browser...',
                        enabled: true,
                        action: component.getProps().openDocumentationBrowser,
                    })

                })
            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
