const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const FileChooserView = require('../../views/FileChooserView')

class FileChooser {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        const parentComponent = this.getProps().parentComponent

        const parentView = parentComponent !== undefined ? parentComponent.getView() : undefined

        return FileChooserView.new({
            title: this.getProps().title,
            mode: this.getProps().mode,
            parentView: parentView,
        })
    }

    synchronizeViewFromModel() {
    }

    open() {
        return this.getView().open()
    }
}

FileChooser = Classification.define(FileChooser)

/// Constructors

FileChooser.openFile = function({ title: title,  parent: parentComponent }) {
    const dialog = this.new({
        title: title,
        mode: 'chooseFile',
        parentComponent: parentComponent
    })

    return dialog.open()
}


module.exports = FileChooser
