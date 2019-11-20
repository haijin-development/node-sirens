const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const SplitterView = require('../../gtk-views/SplitterView')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Splitter {
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
        return SplitterView.new({ orientation: this.getProps().orientation })
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Splitter)