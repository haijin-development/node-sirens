const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const DialogView = require('../../gtk-views/DialogView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Dialog {

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

        return DialogView.new({
            title: this.getProps().title,
            buttons: this.getProps().buttons,
            windowView: windowView,
            dialog: this,
        })
    }

    synchronizeViewFromModel() {
    }

    setButtons(buttonProps) {
        this.getView().setButtons( buttonProps )
    }

    open() {
        return this.getView().open()
    }
}

Dialog = Classification.define(Dialog)

/// Constructors

Dialog.open = function({ window: windowComponent }) {
    const dialog = this.new({
        window: windowComponent,
    })

    return dialog.open()
}


module.exports = Dialog
