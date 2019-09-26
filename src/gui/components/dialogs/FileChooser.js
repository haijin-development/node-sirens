const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const FileChooserView = require('../../gtk-views/FileChooserView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class FileChooser {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumes = [Widget]
        this.implements = [ComponentBehaviourProtocol_Implementation]
    }

    /// Initializing

    defaultModel() {
        return undefined
    }

    createView() {
        const window = this.getProps().window

        const windowView = window !== undefined ? window.getView() : undefined

        return FileChooserView.new({
            title: this.getProps().title,
            mode: this.getProps().mode,
            windowView: windowView,
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

FileChooser.openFile = function({ title: title,  window: windowComponent }) {
    const dialog = this.new({
        title: title,
        mode: 'chooseFile',
        window: windowComponent
    })

    return dialog.open()
}


module.exports = FileChooser
