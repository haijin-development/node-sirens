const Widget = require('../Widget')
const WindowView = require('../../views/WindowView')

class Window extends Widget {
    static openOn(props) {
        const window = new this(props)

        window.open()

        return window
    }

    /// Initializing

    createView() {
        return WindowView.new()
    }

    synchronizeViewFromModel() {
    }

    open() {
        this.view.open()
    }

    /// Asking

    isTopMostComponent() {
        return true
    }
}

module.exports = Window