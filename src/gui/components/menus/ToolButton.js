const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToolButtonView = require('../../gtk-views/ToolButtonView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class ToolButton {
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
        return ToolButtonView.new( this.getProps() )
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(ToolButton)