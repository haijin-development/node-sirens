const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')

class ClassEditorMenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
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

                    this.skip().separator()

                    this.skip().item({
                        label: 'Save file',
                        enabled: true,
                        action: component.getProps().saveFile,
                    })
                })

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
