const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const WindowView = require('../../views/WindowView')

class Window {

    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return WindowView.new()
    }

    synchronizeViewFromModel() {
    }

    open() {
        this.getView().open()
    }

    /// Asking

    isTopMostComponent() {
        return true
    }
}

module.exports = Classification.define(Window)