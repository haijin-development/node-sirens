const Classification = require('../../../../src/o-language/classifications/Classification')
const Component = require('../../../gui/components/Component')
const ComponentProtocol_Implementation = require('../../../gui/protocols/ComponentProtocol_Implementation')

const GtkIcons = require('../../../gui/gtk-views/constants/GtkIcons')
const Resource = require('../../objects/Resource')

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

            this.toolBar( function() {

                this.styles({
                    viewAttributes: {
                        stackSize: 'fixed',
                    }
                })

                this.button({
                    label: 'Open file...',
                    image: {
                        iconName: GtkIcons.open,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a file to edit its class.',
                    action: component.getProps().openFile,
                })

                this.button({
                    label: 'Open file in new window...',
                    image: {
                        iconName: GtkIcons.add,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Opens a file in a new window to edit its class.',
                    action: component.getProps().openFileInNewWindow,
                })

                this.skip().separator()

                this.skip().button({
                    label: 'Save file',
                    image: {
                        iconName: GtkIcons.save,
                        size: GtkIcons.size._24x24,
                    },
                    tooltip: 'Saves the edited file.',
                    action: component.getProps().saveFile,
                })

                this.separator()

                this.button({
                    label: 'Open another class editor',
                    image: {
                        filename: Resource.image.class,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens another class editor.',
                    action: component.getProps().openClassEditor,
                })

                this.button({
                    label: 'Open playground',
                    image: {
                        filename: Resource.image.haiku,
                        width: 24,
                        height: 24,
                    },
                    tooltip: 'Opens a playground.',
                    action: component.getProps().openPlayground,
                })

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
