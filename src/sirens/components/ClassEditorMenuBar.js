const Classification = require('../../../src/o-language/classifications/Classification')
const Component = require('../../gui/components/Component')
const FileChooser = require('../../gui/components/dialogs/FileChooser')

class ClassEditorMenuBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Component]
    }

    /// Actions

    openFile() {
        const parentComponent = this.getProps().parentComponent

        const filename = FileChooser.openFile({ title: 'Choose a file', parent: parentComponent })

        if( filename !== null ) {
            this.getModel().openFile({ filename: filename })
        }
    }

    /// Building

    renderWith(builder) {
        const prototypesModel = this.getModel()

        builder.render(function (component) {

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
        })
    }
}

module.exports = Classification.define(ClassEditorMenuBar)
