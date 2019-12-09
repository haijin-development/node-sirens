const Classification = require('../../../O').Classification
const Component = require('../../../Skins').Component
const ComponentProtocol_Implementation = require('../../../Skins').ComponentProtocol_Implementation


class ClassDocumentationMenuBar {
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
                        label: 'Reload documentation.',
                        action: component.getProps().reloadClassDefinition,
                        enabled: model.getCommand({ id: 'reloadClassDefinition' }),
                    })

                })

                this.menuGroup({ label: 'Browsers' }, function() {
                    this.item({
                        label: 'Open a new class documentation browser...',
                        action: component.getProps().openClassDocumentation,
                        enabled: model.getCommand({ id: 'openClassDocumentation' }),
                    })

                    this.item({
                        label: 'Open a file editor...',
                        action: component.getProps().openFileEditor,
                        enabled: model.getCommand({ id: 'openFileEditor' }),
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

module.exports = Classification.define(ClassDocumentationMenuBar)
