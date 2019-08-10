const PrimitiveComponent = require('../PrimitiveComponent')
const WindowView = require('../../views/WindowView')

class Window extends PrimitiveComponent {
    static openOn(props) {
        const window = new this(props)

        window.open()

        return window
    }

    /// Initializing

    createView() {
        return new WindowView()
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