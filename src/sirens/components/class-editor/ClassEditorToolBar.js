const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

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

            this.toolBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.item({
                    label: 'Open file...',
                    icon: GtkIcons.open,
                    tooltip: 'Opens a file to edit its class.',
                    action: component.getProps().openFile,
                })

                this.item({
                    label: 'Open file in new window...',
                    icon: GtkIcons.add,
                    tooltip: 'Opens a file in a new window to edit its class.',
                    action: component.getProps().openFileInNewWindow,
                })

                this.skip().separator()

                this.skip().item({
                    label: 'Save file',
                    icon: GtkIcons.save,
                    tooltip: 'Saves the edited file.',
                    action: component.getProps().saveFile,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
