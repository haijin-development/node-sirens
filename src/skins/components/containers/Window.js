const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const WindowView = require('../../gtk-views/WindowView')
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
        return WindowView.new({
            onClosed: this.onClosed.bind(this),
        })
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