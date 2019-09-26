const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/GtkIcons')

class ClassEditorMenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Component]
        this.implements = [ComponentProtocol, ComponentProtocol_Implementation]
    }

    /// Building

    renderWith(componentsRenderer) {
        const model = this.getModel()

        componentsRenderer.render(function (component) {

            this.verticalStack( function() {

                this.styles({
                    viewCustomAttributes: {
                        packExpand: false,
                    }
                })

                this.menuBar( function() {

                    this.styles({
                        viewCustomAttributes: {
                            packExpand: false,
                        }
                    })

                    this.menuGroup({ label: 'File' }, function() {
                        this.item({
                            label: 'Open file...',
                            enabled: true,
                            action: component.getProps().openFile,
                        })

                        this.skip().item({
                            label: 'Save file',
                            enabled: true,
                            action: component.getProps().saveFile,
                        })
                    })

                })

                this.toolBar( function() {

                    this.styles({
                        viewCustomAttributes: {
                            packExpand: false,
                        }
                    })

                    this.item({
                        label: 'Open file...',
                        icon: GtkIcons.openFile,
                        tooltip: 'Opens a file to edit its class.',
                        action: component.getProps().openFile,
                    })

                    this.skip().separator()

                    this.skip().item({
                        label: 'Save file',
                        icon: GtkIcons.saveFile,
                        tooltip: 'Saves the edited file.',
                        action: component.getProps().saveFile,
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
