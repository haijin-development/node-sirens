const Classification = require('../../../o-language/classifications/Classification')
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
        return WindowView.new()
    }

    synchronizeViewFromModel() {
    }

    open() {
        this.getView().open()
    }
}

module.exports = Classification.define(Window)