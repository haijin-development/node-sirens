const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const WindowView = require('../../views/WindowView')

class Window extends Classification {
    static openOn(props) {
        const window = new this(props)

        window.open()

        return window
    }

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

module.exports = Window