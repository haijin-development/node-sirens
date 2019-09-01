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
        return FileChooserView.new({
            title: this.getProps().title,
            mode: this.getProps().mode,
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

FileChooser.openFile = function({ title: title }) {
    const dialog = this.new({
        title: title,
        mode: 'openFile',
    })

    return dialog.open()
}


module.exports = FileChooser
