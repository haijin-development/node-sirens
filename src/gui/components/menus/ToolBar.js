const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToolBarView = require('../../gtk-views/ToolBarView')

class ToolBar {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        const label = this.getProps().label

        return ToolBarView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(ToolBar)