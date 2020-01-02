const Classification = require('../../../O').Classification
const Widget = require('../Widget')
const ComponentBehaviourProtocol_Implementation = require('../../protocols/ComponentBehaviourProtocol_Implementation')

class Separator {

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
        const orientation = this.getProps().orientation

        const view = this.namespace().Views.SeparatorView.new({ orientation: orientation })

        view.assemble()

        return view
    }

    synchronizeViewFromModel() {
    }
}

module.exports = Classification.define(Separator)