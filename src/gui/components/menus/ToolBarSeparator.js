const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToolBarSeparatorView = require('../../gtk-views/ToolBarSeparatorView')

class ToolBarSeparator {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return ToolBarSeparatorView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(ToolBarSeparator)