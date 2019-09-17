const Classification = require('../../../o-language/classifications/Classification')
const Widget = require('../Widget')
const ToolBarSeparatorView = require('../../gtk-views/ToolBarSeparatorView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class ToolBarSeparator {
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
        return ToolBarSeparatorView.new()
    }

    /// Synchronizing

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(ToolBarSeparator)