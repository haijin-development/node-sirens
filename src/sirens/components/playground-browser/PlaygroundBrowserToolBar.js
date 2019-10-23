const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')
const ComponentProtocol = require('../../../gui/protocols/ComponentProtocol')
const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')

class PlaygroundBrowserToolBar {
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

                this.button({
                    label: 'Open file...',
                    icon: GtkIcons.open,
                    tooltip: 'Opens a file.',
                    action: component.getProps().openFile,
                })

                this.button({
                    label: 'Open file in new window...',
                    icon: GtkIcons.add,
                    tooltip: 'Opens a file in a new window.',
                    action: component.getProps().openFileInNewWindow,
                })

                this.separator()

                this.button({
                    label: 'Save file',
                    icon: GtkIcons.save,
                    tooltip: 'Saves the opened file.',
                    action: component.getProps().saveFile,
                })

            })

        })
    }
}

module.exports = Classification.define(PlaygroundBrowserToolBar)
