const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Window {

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
        const view = this.namespace().Views.WindowView.new({
            onClosed: this.onClosed.bind(this),
        })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }

    open() {
        this.getView().open()
    }

    // Events

    onClosed() {
        this.releaseComponent()
    }
}

module.exports = Classification.define(Window)