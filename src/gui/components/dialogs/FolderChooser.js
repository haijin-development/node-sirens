const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const FolderChooserView = require('../../gtk-views/FolderChooserView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class FolderChooser {

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

        return FolderChooserView.new({
            title: this.getProps().title,
            mode: this.getProps().mode,
            windowView: windowView,
            initialFolder: this.getProps().initialFolder,
        })
    }

    synchronizeViewFromModel() {
    }

    open() {
        return this.getView().open()
    }
}

FolderChooser = Classification.define(FolderChooser)

/// Constructors

FolderChooser.chooseFolder = function({ title: title,  window: windowComponent, initialFolder: initialFolder }) {
    const dialog = this.new({
        title: title,
        mode: 'chooseFolder',
        window: windowComponent,
        initialFolder: initialFolder,
    })

    return dialog.open()
}

module.exports = FolderChooser
