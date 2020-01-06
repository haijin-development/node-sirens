const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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

        const view = this.namespace().Views.FolderChooserView.new({
            title: this.getProps().title,
            mode: this.getProps().mode,
            windowView: windowView,
            initialFolder: this.getProps().initialFolder,
        })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }

    open() {
        return this.getView().open()
    }

    chooseFolder({ title: title,  window: windowComponent, initialFolder: initialFolder }) {
        this.setProps({
            title: title,
            mode: 'chooseFolder',
            window: windowComponent,
            initialFolder: initialFolder,
        })

        this.assemble()

        return this.open()
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
