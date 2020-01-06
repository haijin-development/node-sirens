const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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
        const props = this.getProps()

        const window = props.window

        const windowView = window !== undefined ? window.getView() : undefined

        const view = this.namespace().Views.DialogView.new({
            title: props.title,
            buttons: props.buttons,
            //windowView: windowView,
            dialog: this,
        })

        view.assemble()

        return view
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
