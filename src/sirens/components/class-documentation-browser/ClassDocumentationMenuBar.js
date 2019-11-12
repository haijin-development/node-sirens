const Classification = require('../../../O').Classification
const Component = require('../../../GUI').Component
const ComponentProtocol_Implementation = require('../../../GUI').ComponentProtocol_Implementation


class ClassDocumentationMenuBar {
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

module.exports = Classification.define(ClassDocumentationMenuBar)
