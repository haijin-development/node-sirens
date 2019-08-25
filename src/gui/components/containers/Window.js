const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const WindowView = require('../../views/WindowView')

const Window = Classification.define( class {

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
})

module.exports = Window