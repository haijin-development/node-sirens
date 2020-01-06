const Classification = require('../../../O').Classification
const Widget = require('../Widget')
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
        const view = this.namespace().Views.SplitterView.new({ orientation: this.getProps().orientation })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Splitter)