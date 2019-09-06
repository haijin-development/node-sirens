const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToolButtonView = require('../../gtk-views/ToolButtonView')

class ToolButton {
    /// Definition

    static definition() {
        this.instanceVariables = []
        this.assumptions = [Widget]
    }

    /// Initializing

    createView() {
        return ToolButtonView.new( this.getProps() )
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(ToolButton)