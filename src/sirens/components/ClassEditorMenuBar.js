const Classification = require('../../../src/o-language/classifications/Classification')
const Component = require('../../gui/components/Component')
const FileChooser = require('../../gui/components/dialogs/FileChooser')
const GtkIcons = require('../../gui/gtk-views/GtkIcons')

class ClassEditorMenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Actions

    openFile() {
        const filename = FileChooser.openFile({ title: 'Choose a file', parent: this.getParentComponent() })

        if( filename !== null ) {
            this.getModel().openFile({ filename: filename })
        }
    }

    /*
     * This logic needs to be re done.
     */
    saveFile() {
        const tabsComponent = this.getParentComponent().getChildComponent({ id: 'tabs' })

        const selectedPageComponent = tabsComponent.getSelectedPageComponent()

        this.getModel().saveFile({
            changedModel: selectedPageComponent.getModel()
        })
    }

    /// Building

    renderWith(builder) {
        const model = this.getModel()

        builder.render(function (component) {

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
                            action: component.openFile.bind(component),
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
                        action: component.openFile.bind(component),
                    })

                    this.separator()

                    this.item({
                        label: 'Save file',
                        icon: GtkIcons.saveFile,
                        tooltip: 'Saves the edited file.',
                        action: component.saveFile.bind(component),
                    })

                })

            })

        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
