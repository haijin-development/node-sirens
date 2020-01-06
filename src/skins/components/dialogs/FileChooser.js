const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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

        const view = this.namespace().Views.FileChooserView.new({
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

    openFile({ title: title,  window: windowComponent, initialFolder: initialFolder }) {
        this.setProps({
            title: title,
            mode: 'chooseFile',
            window: windowComponent,
            initialFolder: initialFolder,
        })

        this.assemble()

        return this.getView().open()
    }
}

module.exports = Classification.define(FileChooser)
